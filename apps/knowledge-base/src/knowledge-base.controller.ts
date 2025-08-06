import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseDto } from './dto/knowledge-base.dto';
import { RequireLogin, UserInfo } from '@app/common';

@Controller('knowledge-base')
@RequireLogin()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  // 创建知识库
  @Post('create')
  async createKnowledgeBase(
    @Body() knowledgeBaseDto: KnowledgeBaseDto,
    @UserInfo('userId') userId: number,
  ) {
    return await this.knowledgeBaseService.createKnowledgeBase(
      knowledgeBaseDto,
      userId,
    );
  }

  // 获取知识库列表
  // TODO: 分页
  @Get('list')
  async knowledgeBaseList(@UserInfo('userId') userId: number) {
    return this.knowledgeBaseService.knowledgeBaseList(userId);
  }

  // 获取知识库详情
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.knowledgeBaseService.findOne(id);
  }

  // 删除知识库，仅做逻辑删除
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo('userId') userId: number) {
    return this.knowledgeBaseService.remove(id, userId);
  }
}
