import { NestFactory } from '@nestjs/core';
import { DirectoryModule } from './directory.module';
import { FormatResponseInterceptor } from '@app/common/format-response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(DirectoryModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FormatResponseInterceptor());

  app.enableCors();
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
