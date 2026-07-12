import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '@prisma/client';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  theme?: string;

  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  weeklyDigest?: boolean;

  @IsBoolean()
  @IsOptional()
  securityAlerts?: boolean;
}

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current settings' })
  async getSettings(@GetUser() user: User) {
    return this.settingsService.getSettings(user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user settings' })
  async updateSettings(@GetUser() user: User, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(user.id, dto);
  }
}
