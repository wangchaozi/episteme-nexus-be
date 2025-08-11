import { Module } from '@nestjs/common';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';

@Module({
  imports: [],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class DirectoryModule {}
