import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PostStatus, PlatformType } from '@prisma/client';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getPosts(userId: string, startDate?: string, endDate?: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId },
    });

    if (accounts.length === 0) return [];

    const accountIds = accounts.map((a) => a.id);

    return this.prisma.post.findMany({
      where: {
        accountId: { in: accountIds },
        ...(startDate && endDate
          ? {
              OR: [
                {
                  scheduledFor: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                  },
                },
                {
                  publishedAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        account: {
          select: {
            handle: true,
            platform: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(userId: string, data: { accountId: string; title?: string; content: string; status: PostStatus; scheduledFor?: string; mediaUrl?: string }) {
    // Verify account ownership
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: data.accountId },
    });

    if (!account || account.userId !== userId) {
      throw new BadRequestException('Invalid social account selected');
    }

    return this.prisma.post.create({
      data: {
        accountId: data.accountId,
        platform: account.platform,
        title: data.title,
        content: data.content,
        status: data.status,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        mediaUrl: data.mediaUrl,
      },
    });
  }

  async updatePost(
    userId: string,
    postId: string,
    data: { title?: string; content?: string; status?: PostStatus; scheduledFor?: string; mediaUrl?: string },
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { account: true },
    });

    if (!post || post.account.userId !== userId) {
      throw new BadRequestException('Post not found or access denied');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        content: data.content,
        status: data.status,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : data.scheduledFor === null ? null : undefined,
        mediaUrl: data.mediaUrl,
      },
    });
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { account: true },
    });

    if (!post || post.account.userId !== userId) {
      throw new BadRequestException('Post not found or access denied');
    }

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
