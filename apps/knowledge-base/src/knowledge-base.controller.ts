import { Body, Controller, Get, Post } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseDto } from './dto/knowledge-base.dto';
import { RequireLogin, UserInfo } from '@app/common';

@Controller('knowledge-base')
@RequireLogin()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  // 创建文章
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

  // 获取文章列表
  // TODO: 分页
  @Get('list')
  async knowledgeBaseList(@UserInfo('userId') userId: number) {
    return this.knowledgeBaseService.knowledgeBaseList(userId);
  }

  // 获取知识库详情
}
