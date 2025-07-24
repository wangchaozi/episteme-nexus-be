import { Injectable } from '@nestjs/common';

@Injectable()
export class KnowledgeBaseService {
  getHello(): string {
    return 'Hello World!';
  }
}
