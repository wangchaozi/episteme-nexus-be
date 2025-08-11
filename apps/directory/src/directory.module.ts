import { Module } from '@nestjs/common';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';
import { PrismaModule } from '@app/prisma';
import { AuthGuard, CommonModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [DirectoryController],
  providers: [
    DirectoryService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class DirectoryModule {}
