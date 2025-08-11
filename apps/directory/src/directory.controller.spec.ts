import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';

describe('DirectoryController', () => {
  let directoryController: DirectoryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DirectoryController],
      providers: [DirectoryService],
    }).compile();

    directoryController = app.get<DirectoryController>(DirectoryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(directoryController.getHello()).toBe('Hello World!');
    });
  });
});
