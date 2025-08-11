import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UserInfo } from '@app/common';
import { UpdateDirectoryDto } from './dto/update-directory.dto';

@Controller()
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  // 创建目录
  @Post('knowledge-bases/:knowledgeBaseId/directories')
  async createDirectories(
    @Param('knowledgeBaseId') knowledgeBaseId: number,
    @Body() createDirectoryDto: CreateDirectoryDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.directoryService.createDirectories(
      knowledgeBaseId,
      createDirectoryDto,
      userId,
    );
  }

  // 获取指定知识库下的目录
  @Get('knowledge-bases/:knowledgeBaseId/directories')
  async directoriesList(@Param('knowledgeBaseId') knowledgeBaseId: number) {
    return this.directoryService.directoriesList(knowledgeBaseId);
  }

  // 更新目录
  @Put('directories/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDirectoryDto: UpdateDirectoryDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.directoryService.update(id, updateDirectoryDto, userId);
  }

  // 删除目录，仅做逻辑删除
  @Put('directories/:id/remove')
  async remove(@Param('id') id: number, @UserInfo('userId') userId: number) {
    return this.directoryService.remove(id, userId);
  }
}
