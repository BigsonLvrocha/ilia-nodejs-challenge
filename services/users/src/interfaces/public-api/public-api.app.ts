import { NestFactory } from '@nestjs/core';
import { PublicApiModule } from './public-api.module.js';
import { type INestApplication, ValidationPipe } from '@nestjs/common';

export async function startPublicApiApp(): Promise<INestApplication> {
  const app = await NestFactory.create(PublicApiModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3002);
  return app;
}
