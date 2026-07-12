import { Module, Global } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [PrismaService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
