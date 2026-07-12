import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PlatformType, Prisma } from '@prisma/client';

@Injectable()
export class CompetitorsService {
  constructor(private prisma: PrismaService) {}

  async listCompetitors(userId: string) {
    return this.prisma.competitor.findMany({
      where: { userId },
      orderBy: { followers: 'desc' },
    });
  }

  async addCompetitor(userId: string, platform: PlatformType, handle: string, displayName?: string) {
    // Check limit (e.g. 5 competitors max for demonstration/Pro tier check)
    const count = await this.prisma.competitor.count({ where: { userId } });
    if (count >= 10) {
      throw new BadRequestException('You have reached the maximum number of tracked competitors (10).');
    }

    const followers = Math.floor(Math.random() * 150000) + 5000;
    const engagementRate = Number((Math.random() * 5 + 1).toFixed(2));
    const weeklyGrowthRate = Number((Math.random() * 3 + 0.2).toFixed(2));

    const competitor = await this.prisma.competitor.create({
      data: {
        userId,
        platform,
        handle,
        displayName: displayName || handle,
        avatarUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 9999999)}?w=150`,
        followers,
        engagementRate,
        weeklyGrowthRate,
      },
    });

    // Auto-seed competitor metrics for visual rendering in charts
    await this.seedCompetitorMetrics(competitor.id, followers, engagementRate);

    return competitor;
  }

  async removeCompetitor(userId: string, id: string) {
    const competitor = await this.prisma.competitor.findUnique({
      where: { id },
    });

    if (!competitor || competitor.userId !== userId) {
      throw new BadRequestException('Competitor not found or access denied');
    }

    return this.prisma.competitor.delete({
      where: { id },
    });
  }

  async getComparison(userId: string, platform: PlatformType) {
    const competitors = await this.prisma.competitor.findMany({
      where: { userId, platform },
      include: {
        metrics: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });

    const userAccounts = await this.prisma.socialAccount.findMany({
      where: { userId, platform },
      include: {
        metrics: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });

    // Format comparisons
    const myAccount = userAccounts[0];
    const myLatestMetric = myAccount?.metrics[0];

    const benchmarkList = competitors.map((comp) => {
      const latestMetric = comp.metrics[0];
      return {
        id: comp.id,
        name: comp.displayName || comp.handle,
        handle: comp.handle,
        isUser: false,
        followers: comp.followers,
        engagementRate: comp.engagementRate,
        growthRate: comp.weeklyGrowthRate,
        postsCount: latestMetric?.postsCount || 10,
      };
    });

    if (myAccount) {
      benchmarkList.unshift({
        id: myAccount.id,
        name: myAccount.displayName || myAccount.handle,
        handle: myAccount.handle,
        isUser: true,
        followers: myLatestMetric?.followers || 0,
        engagementRate: myLatestMetric?.engagementRate || 0,
        growthRate: 1.5, // Seed growth
        postsCount: myLatestMetric?.totalPosts || 15,
      });
    }

    // Generate AI Summary text
    let aiSummary = '';
    if (benchmarkList.length > 1) {
      const userObj = benchmarkList.find(b => b.isUser);
      const competitorsOnly = benchmarkList.filter(b => !b.isUser);
      const leadingComp = competitorsOnly.sort((a, b) => b.followers - a.followers)[0];

      if (userObj) {
        const diff = leadingComp.followers - userObj.followers;
        aiSummary = `You are currently trailing the category leader (${leadingComp.name}) by ${diff.toLocaleString()} followers. However, your engagement rate is ${userObj.engagementRate}% compared to their ${leadingComp.engagementRate}%. This high-affinity engagement suggests that increasing your posting frequency will trigger rapid audience growth.`;
      } else {
        aiSummary = `Tracked competitors on ${platform} average ${Number((competitorsOnly.reduce((sum, c) => sum + c.followers, 0) / competitorsOnly.length).toFixed(0)).toLocaleString()} followers with an average engagement rate of ${Number((competitorsOnly.reduce((sum, c) => sum + c.engagementRate, 0) / competitorsOnly.length).toFixed(2))}%. Add your profile to get personalized comparisons!`;
      }
    } else {
      aiSummary = 'Add competitors above to unlock visual benchmarking charts and AI-driven comparison reports.';
    }

    return {
      benchmarks: benchmarkList,
      aiSummary,
    };
  }

  private async seedCompetitorMetrics(competitorId: string, baseFollowers: number, er: number) {
    const now = new Date();
    const data: Prisma.CompetitorMetricCreateManyInput[] = [];

    let followers = baseFollowers - 1000;
    for (let i = 14; i >= 0; i--) {
      const recordedAt = new Date();
      recordedAt.setDate(now.getDate() - i);
      followers += Math.floor(Math.random() * 80) + 15;

      data.push({
        competitorId,
        recordedAt,
        followers,
        engagementRate: Number((er + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        growthRate: 1.0 + Math.random() * 0.4,
        postsCount: 5 + Math.floor(Math.random() * 3),
      });
    }

    await this.prisma.competitorMetric.createMany({ data });
  }
}
