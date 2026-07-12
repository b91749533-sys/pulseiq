import { Controller, Get, Post, Delete, Body, Param, UseGuards, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsISO8601()
  @IsNotEmpty()
  rangeStart: string;

  @IsISO8601()
  @IsNotEmpty()
  rangeEnd: string;

  @IsString()
  @IsNotEmpty()
  format: string; // PDF, EXCEL, CSV
}

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'List all generated reports' })
  async listReports(@GetUser() user: User) {
    return this.reportsService.listReports(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Generate a new report' })
  async createReport(@GetUser() user: User, @Body() dto: CreateReportDto) {
    return this.reportsService.createReport(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report record' })
  async deleteReport(@GetUser() user: User, @Param('id') id: string) {
    return this.reportsService.deleteReport(user.id, id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download compiled report file' })
  async downloadReport(
    @GetUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { report, metrics } = await this.reportsService.compileReportData(user.id, id);

    const filename = `${report.title.toLowerCase().replace(/\s+/g, '_')}_export.${report.format.toLowerCase()}`;

    if (report.format === 'CSV') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Compile CSV String
      let csvContent = 'Platform,Handle,Date,Followers,Views,Reach,Likes,Comments,Shares,EngagementRate\n';
      for (const m of metrics) {
        const dateStr = m.recordedAt.toISOString().split('T')[0];
        csvContent += `"${m.account.platform}","${m.account.handle}","${dateStr}",${m.followers},${m.views},${m.reach},${m.likes},${m.comments},${m.shares},${m.engagementRate}\n`;
      }
      return res.send(csvContent);
    } else if (report.format === 'PDF') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      // Return simple mock PDF layout
      return res.send(Buffer.from(`%PDF-1.4\n1 0 obj\n<< /Title (${report.title}) /Author (InsightFlow By Youssef Manssouri) >>\nendobj\n`));
    } else {
      // Excel or other formats
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      let csvContent = 'Platform,Handle,Date,Followers,Views,Reach,Likes,Comments,Shares,EngagementRate\n';
      for (const m of metrics) {
        const dateStr = m.recordedAt.toISOString().split('T')[0];
        csvContent += `"${m.account.platform}","${m.account.handle}","${dateStr}",${m.followers},${m.views},${m.reach},${m.likes},${m.comments},${m.shares},${m.engagementRate}\n`;
      }
      return res.send(Buffer.from(csvContent));
    }
  }
}
