import { Module } from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { CompetitorsController } from './competitors.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [CompetitorsController],
  providers: [CompetitorsService, PrismaService],
  exports: [CompetitorsService],
})
export class CompetitorsModule {}
