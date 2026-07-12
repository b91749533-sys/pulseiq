import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User, PlatformType } from '@prisma/client';
import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

class ConnectAccountDto {
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

@ApiTags('social')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'List connected social accounts' })
  async listAccounts(@GetUser() user: User) {
    return this.socialService.listAccounts(user.id);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect/Simulate a new social account' })
  async connectAccount(@GetUser() user: User, @Body() dto: ConnectAccountDto) {
    return this.socialService.connectAccount(user.id, dto.platform, dto.handle, dto.displayName);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Disconnect a social account' })
  async disconnectAccount(@GetUser() user: User, @Param('id') id: string) {
    return this.socialService.disconnectAccount(user.id, id);
  }
}
