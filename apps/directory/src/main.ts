import { NestFactory } from '@nestjs/core';
import { DirectoryModule } from './directory.module';

async function bootstrap() {
  const app = await NestFactory.create(DirectoryModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
