import { NestFactory } from '@nestjs/core';
import { KnowledgeBaseModule } from './knowledge-base.module';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from '@app/common/format-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(KnowledgeBaseModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
