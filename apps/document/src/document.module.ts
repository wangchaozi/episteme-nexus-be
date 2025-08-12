import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CommonModule, AuthGuard } from '@app/common';
import { PrismaModule } from '@app/prisma';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class DocumentModule {}
