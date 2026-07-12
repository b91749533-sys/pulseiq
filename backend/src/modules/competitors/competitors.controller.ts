import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User, PlatformType } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

class AddCompetitorDto {
  @IsEnum(PlatformType)
  @IsNotEmpty()
  platform: PlatformType;

  @IsString()
  @IsNotEmpty()
  handle: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}

@ApiTags('competitors')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('competitors')
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  @Get()
  @ApiOperation({ summary: 'List all tracked competitors' })
  async listCompetitors(@GetUser() user: User) {
    return this.competitorsService.listCompetitors(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new competitor' })
  async addCompetitor(@GetUser() user: User, @Body() dto: AddCompetitorDto) {
    return this.competitorsService.addCompetitor(user.id, dto.platform, dto.handle, dto.displayName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a competitor profile' })
  async removeCompetitor(@GetUser() user: User, @Param('id') id: string) {
    return this.competitorsService.removeCompetitor(user.id, id);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare user metrics with competitors' })
  @ApiQuery({ name: 'platform', enum: PlatformType })
  async getComparison(
    @GetUser() user: User,
    @Query('platform') platform: PlatformType = PlatformType.YOUTUBE,
  ) {
    return this.competitorsService.getComparison(user.id, platform);
  }
}
