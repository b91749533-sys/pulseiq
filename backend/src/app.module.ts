import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SocialModule } from './modules/social/social.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CompetitorsModule } from './modules/competitors/competitors.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SyncModule } from './jobs/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    AuthModule,
    UsersModule,
    SocialModule,
    AnalyticsModule,
    AiModule,
    CalendarModule,
    CompetitorsModule,
    ReportsModule,
    NotificationsModule,
    SettingsModule,
    SyncModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
