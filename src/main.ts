import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))
  app.enableCors({
    origin: process.env.URL_FRONT,
  })
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();