import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Processor('sync-queue')
@Injectable()
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Starting background sync job: ${job.id} (${job.name})`);

    if (job.name === 'sync-user-analytics') {
      const { userId } = job.data;
      await this.syncUserAnalytics(userId);
    }

    this.logger.log(`Completed background sync job: ${job.id}`);
    return { success: true };
  }

  private async syncUserAnalytics(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId },
    });

    for (const acc of accounts) {
      this.logger.log(`Syncing profile ${acc.platform} ${acc.handle} for user ${userId}`);

      // Query latest metric
      const latestMetric = await this.prisma.analyticsMetric.findFirst({
        where: { accountId: acc.id },
        orderBy: { recordedAt: 'desc' },
      });

      if (!latestMetric) continue;

      // Simulate a small growth overnight
      const growth = Math.floor(Math.random() * 50) + 5;
      const viewsAddition = Math.floor(Math.random() * 500) + 100;
      
      const newFollowers = latestMetric.followers + growth;
      const newViews = latestMetric.views + viewsAddition;
      const newReach = Math.floor(newViews * 0.82);
      const newImpressions = Math.floor(newViews * 1.35);

      const newLikes = Math.floor(viewsAddition * (latestMetric.engagementRate / 100) * 0.7);
      const newComments = Math.floor(newLikes * 0.15);
      const newShares = Math.floor(newLikes * 0.1);

      await this.prisma.analyticsMetric.create({
        data: {
          accountId: acc.id,
          recordedAt: new Date(),
          followers: newFollowers,
          following: latestMetric.following,
          totalPosts: latestMetric.totalPosts,
          reach: latestMetric.reach + newReach,
          impressions: latestMetric.impressions + newImpressions,
          engagementRate: latestMetric.engagementRate,
          views: newViews,
          likes: latestMetric.likes + newLikes,
          comments: latestMetric.comments + newComments,
          shares: latestMetric.shares + newShares,
        },
      });

      // Optionally trigger notifications
      if (Math.random() > 0.7) {
        await this.prisma.notification.create({
          data: {
            userId,
            title: 'Daily Report Synced',
            message: `Overnight sync complete! ${acc.platform} gained ${growth} new followers.`,
            type: 'success',
          },
        });
      }
    }
  }
}
