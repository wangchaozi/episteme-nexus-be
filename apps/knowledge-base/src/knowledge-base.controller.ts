import { Controller, Get } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Get()
  getHello(): string {
    return this.knowledgeBaseService.getHello();
  }
}
