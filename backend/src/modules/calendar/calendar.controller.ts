import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User, PostStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsISO8601 } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @IsISO8601()
  @IsOptional()
  scheduledFor?: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;
}

class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @IsISO8601()
  @IsOptional()
  scheduledFor?: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;
}

@ApiTags('calendar')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Get calendar posts' })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  async getPosts(
    @GetUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.calendarService.getPosts(user.id, startDate, endDate);
  }

  @Post('posts')
  @ApiOperation({ summary: 'Create new scheduled post or draft' })
  async createPost(@GetUser() user: User, @Body() dto: CreatePostDto) {
    return this.calendarService.createPost(user.id, dto);
  }

  @Patch('posts/:id')
  @ApiOperation({ summary: 'Update post parameters' })
  async updatePost(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.calendarService.updatePost(user.id, id, dto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Delete post from scheduler' })
  async deletePost(@GetUser() user: User, @Param('id') id: string) {
    return this.calendarService.deletePost(user.id, id);
  }
}
