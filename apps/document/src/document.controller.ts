import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { RequireLogin, UserInfo } from '@app/common';
import { CreateDocumentDto } from './dto/create-document.dto';
// import { RestoreVersionDto } from './dto/restore-version.dto';
import { PaginationDto } from '@app/common/dto/pagination.dto';

@Controller()
@RequireLogin()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('documents')
  async create(
    @Body() createDto: CreateDocumentDto,
    @UserInfo('userId') userId: number,
  ) {
    return await this.documentService.create(createDto, userId);
  }

  // 获取知识库下的文档列表
  @Get('knowledge-bases/:knowledgeBaseId/documents')
  async documentsList(
    @Param('knowledgeBaseId') knowledgeBaseId: number,
    @Query() paginationDto: PaginationDto,
    @Query('directoryId') directoryId?: number,
    @Query('tagId') tagId?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.documentService.documentsList({
      ...paginationDto,
      knowledgeBaseId,
      directoryId,
      tagId,
      keyword,
    });
  }

  // 获取文档详情
  @Get('documents/:id')
  async findOne(@Param('id') id: number) {
    return this.documentService.findOne(id);
  }

  // 更新文档
  @Put('documents/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: CreateDocumentDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.documentService.update(id, updateDto, userId);
  }

  // 删除文档
  @Delete('documents/:id')
  async remove(@Param('id') id: number, @UserInfo('userId') userId: number) {
    return this.documentService.remove(id, userId);
  }

  // 获取文档版本列表
  // @Get('documents/:id/versions')
  // async versions(@Param('id') id: number) {
  //   return this.documentService.versions(id);
  // }

  // // 恢复到历史版本
  // @Post('documents/:id/restore')
  // async restore(
  //   @Param('id') id: number,
  //   @Body() restoreDto: RestoreVersionDto,
  //   @UserInfo('userId') userId: number,
  // ) {
  //   return this.documentService.restore(id, userId, restoreDto);
  // }
}
