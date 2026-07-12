import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SyncProcessor } from './sync.processor';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sync-queue',
    }),
  ],
  providers: [SyncProcessor, PrismaService],
})
export class SyncModule {}
