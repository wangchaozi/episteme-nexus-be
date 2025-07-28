import { NestFactory } from '@nestjs/core';
import { KnowledgeBaseModule } from './knowledge-base.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(KnowledgeBaseModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
