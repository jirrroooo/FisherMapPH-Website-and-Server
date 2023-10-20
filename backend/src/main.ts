import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND,
    credentials: true
  });

  await app.listen(3001);
}
bootstrap();
