import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';

describe('KnowledgeBaseController', () => {
  let knowledgeBaseController: KnowledgeBaseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgeBaseController],
      providers: [KnowledgeBaseService],
    }).compile();

    knowledgeBaseController = app.get<KnowledgeBaseController>(KnowledgeBaseController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(knowledgeBaseController.getHello()).toBe('Hello World!');
    });
  });
});
