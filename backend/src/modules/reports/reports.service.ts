import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async listReports(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReport(userId: string, data: { title: string; rangeStart: string; rangeEnd: string; format: string }) {
    // Register metadata in DB
    return this.prisma.report.create({
      data: {
        userId,
        title: data.title,
        rangeStart: new Date(data.rangeStart),
        rangeEnd: new Date(data.rangeEnd),
        format: data.format.toUpperCase(),
        fileUrl: `/api/reports/download/mock_${data.format.toLowerCase()}_file`,
      },
    });
  }

  async compileReportData(userId: string, reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report || report.userId !== userId) {
      throw new BadRequestException('Report not found or access denied');
    }

    // Query social metrics in the given date range
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId },
    });

    const accountIds = accounts.map((a) => a.id);

    const metrics = await this.prisma.analyticsMetric.findMany({
      where: {
        accountId: { in: accountIds },
        recordedAt: {
          gte: report.rangeStart,
          lte: report.rangeEnd,
        },
      },
      include: {
        account: {
          select: {
            platform: true,
            handle: true,
          },
        },
      },
      orderBy: { recordedAt: 'asc' },
    });

    return {
      report,
      metrics,
    };
  }

  async deleteReport(userId: string, id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report || report.userId !== userId) {
      throw new BadRequestException('Report not found or access denied');
    }

    return this.prisma.report.delete({
      where: { id },
    });
  }
}
