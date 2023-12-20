import { NestFactory } from '@nestjs/core';
import { PrivateApiModule } from './private-api.module.js';
import { ValidationPipe, type INestApplication } from '@nestjs/common';

export async function startPrivateApiApp(): Promise<INestApplication> {
  const app = await NestFactory.create(PrivateApiModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3003);

  return app;
}
