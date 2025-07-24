import { NestFactory } from '@nestjs/core';
import { KnowledgeBaseModule } from './knowledge-base.module';

async function bootstrap() {
  const app = await NestFactory.create(KnowledgeBaseModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
