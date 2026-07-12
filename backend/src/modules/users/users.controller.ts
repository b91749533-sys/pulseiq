import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get user recent activity logs' })
  async getActivityLogs(@GetUser() user: User) {
    return this.usersService.getActivityLogs(user.id);
  }
}
