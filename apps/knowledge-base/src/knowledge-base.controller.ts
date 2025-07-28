import { Body, Controller, Get, Post } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseDto } from './dto/knowledge-base.dto';
import { RequireLogin, UserInfo } from '@app/common';

@Controller('knowledge-base')
@RequireLogin()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

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

  @Get('list')
  async knowledgeBaseList(@UserInfo('userId') userId: number) {
    return this.knowledgeBaseService.knowledgeBaseList(userId);
  }
}
