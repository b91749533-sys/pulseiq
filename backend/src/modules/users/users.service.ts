import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        settings: true,
        _count: {
          select: { accounts: true },
        },
      },
    });
  }

  async logActivity(userId: string, action: string, details?: string, ipAddress?: string) {
    return this.prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
      },
    });
  }

  async getActivityLogs(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
