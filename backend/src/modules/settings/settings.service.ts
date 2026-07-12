import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(userId: string) {
    return this.prisma.settings.findUnique({
      where: { userId },
    });
  }

  async updateSettings(
    userId: string,
    data: { theme?: string; emailNotifications?: boolean; weeklyDigest?: boolean; securityAlerts?: boolean },
  ) {
    return this.prisma.settings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        theme: data.theme || 'dark',
        emailNotifications: data.emailNotifications ?? true,
        weeklyDigest: data.weeklyDigest ?? true,
        securityAlerts: data.securityAlerts ?? true,
      },
    });
  }
}
