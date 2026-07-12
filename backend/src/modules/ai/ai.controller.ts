import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

class CreateConversationDto {
  @IsString()
  @IsOptional()
  title?: string;
}

class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations' })
  async listConversations(@GetUser() user: User) {
    return this.aiService.listConversations(user.id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  async createConversation(@GetUser() user: User, @Body() dto: CreateConversationDto) {
    return this.aiService.createConversation(user.id, dto.title);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  async getMessages(@GetUser() user: User, @Param('id') id: string) {
    return this.aiService.getMessages(id, user.id);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send message and get AI response' })
  async sendMessage(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.aiService.sendMessage(user.id, id, dto.content);
  }
}
