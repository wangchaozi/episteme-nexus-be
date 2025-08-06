import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from '@app/common/format-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FormatResponseInterceptor());

  app.enableCors();
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
