import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PlatformType, Prisma } from '@prisma/client';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async listAccounts(userId: string) {
    return this.prisma.socialAccount.findMany({
      where: { userId },
      select: {
        id: true,
        platform: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  async connectAccount(userId: string, platform: PlatformType, handle: string, displayName?: string) {
    const platformLower = platform.toLowerCase();
    const platformId = `simulated_id_${platformLower}_${Math.random().toString(36).substr(2, 9)}`;
    const avatarUrl = this.getPlatformAvatar(platform);

    // Write to DB
    const account = await this.prisma.socialAccount.upsert({
      where: {
        userId_platform_platformId: {
          userId,
          platform,
          platformId,
        },
      },
      update: {
        handle,
        displayName: displayName || handle,
        accessToken: 'simulated_access_token',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        platform,
        platformId,
        handle,
        displayName: displayName || handle,
        avatarUrl,
        accessToken: 'simulated_access_token',
      },
    });

    // Automatically seed metrics so the dashboard lights up with gorgeous data immediately!
    await this.seedConnectedMetrics(account.id, platform);

    return account;
  }

  async disconnectAccount(userId: string, accountId: string) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || account.userId !== userId) {
      throw new BadRequestException('Account not found or access denied');
    }

    return this.prisma.socialAccount.delete({
      where: { id: accountId },
    });
  }

  private getPlatformAvatar(platform: PlatformType): string {
    switch (platform) {
      case PlatformType.YOUTUBE:
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150';
      case PlatformType.INSTAGRAM:
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
      case PlatformType.TIKTOK:
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
      case PlatformType.LINKEDIN:
        return 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150';
      case PlatformType.TWITTER:
        return 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150';
      default:
        return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
    }
  }

  private async seedConnectedMetrics(accountId: string, platform: PlatformType) {
    let baseFollowers = 10000;
    let reachFactor = 5000;
    let er = 3.5;

    switch (platform) {
      case PlatformType.YOUTUBE:
        baseFollowers = 25000; reachFactor = 10000; er = 4.1; break;
      case PlatformType.INSTAGRAM:
        baseFollowers = 42000; reachFactor = 15000; er = 5.6; break;
      case PlatformType.TIKTOK:
        baseFollowers = 115000; reachFactor = 48000; er = 8.2; break;
      case PlatformType.LINKEDIN:
        baseFollowers = 5400; reachFactor = 3000; er = 6.8; break;
      case PlatformType.TWITTER:
        baseFollowers = 14500; reachFactor = 8000; er = 2.4; break;
    }

    const now = new Date();
    const data: Prisma.AnalyticsMetricCreateManyInput[] = [];

    // Seed 14 days of history
    for (let i = 14; i >= 0; i--) {
      const recordedAt = new Date();
      recordedAt.setDate(now.getDate() - i);
      const growth = Math.floor(Math.random() * 80) + 10;
      baseFollowers += growth;

      const views = Math.floor(reachFactor * (0.8 + Math.random() * 0.4));
      const reach = Math.floor(views * 0.8);
      const impressions = Math.floor(views * 1.3);
      const likes = Math.floor(views * (er / 100) * 0.7);
      const comments = Math.floor(likes * 0.15);
      const shares = Math.floor(likes * 0.1);

      data.push({
        accountId,
        recordedAt,
        followers: baseFollowers,
        following: Math.floor(baseFollowers * 0.015),
        totalPosts: 10 + (14 - i),
        reach,
        impressions,
        engagementRate: Number((er + (Math.random() * 0.6 - 0.3)).toFixed(2)),
        views,
        likes,
        shares,
        comments,
      });
    }

    await this.prisma.analyticsMetric.createMany({ data });
  }
}
