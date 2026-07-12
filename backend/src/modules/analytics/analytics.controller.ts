import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User, PlatformType } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get accumulated analytics metrics across accounts' })
  async getSummary(@GetUser() user: User) {
    return this.analyticsService.getSummary(user.id);
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical metrics for charts' })
  @ApiQuery({ name: 'range', enum: ['day', 'week', 'month', 'year'], required: false })
  @ApiQuery({ name: 'platform', enum: PlatformType, required: false })
  async getHistorical(
    @GetUser() user: User,
    @Query('range') range: 'day' | 'week' | 'month' | 'year' = 'month',
    @Query('platform') platform?: PlatformType,
  ) {
    return this.analyticsService.getHistorical(user.id, range, platform);
  }

  @Get('top-posts')
  @ApiOperation({ summary: 'Get top performing posts' })
  @ApiQuery({ name: 'platform', enum: PlatformType, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getTopPosts(
    @GetUser() user: User,
    @Query('platform') platform?: PlatformType,
    @Query('limit') limit?: string,
  ) {
    const numericLimit = limit ? parseInt(limit, 10) : 5;
    return this.analyticsService.getTopPosts(user.id, platform, numericLimit);
  }

  @Get('demographics')
  @ApiOperation({ summary: 'Get device and geographic demographics' })
  async getDemographics(@GetUser() user: User) {
    return this.analyticsService.getDemographics(user.id);
  }
}
