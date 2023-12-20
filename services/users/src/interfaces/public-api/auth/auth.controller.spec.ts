import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { describe, it, afterEach, beforeEach, expect } from '@jest/globals';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { type NestApplication } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  UserDefinition,
  type UserModel,
} from '../../../infrastructure/model/user.schema.js';
import { PublicApiAuthModule } from './public-api-auth.module.js';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';

describe('AuthController', () => {
  let testModule: TestingModule;
  let mongoServer: MongoMemoryServer;
  let app: NestApplication;
  let userModel: UserModel;
  let jwtService: JwtService;

  const userData = {
    id: uuid(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    passwordHash: bcrypt.hashSync('password', 10),
  };

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongoServer.getUri(),
          }),
        }),
        PublicApiAuthModule,
      ],
    }).compile();

    app = testModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    userModel = testModule.get<UserModel>(getModelToken(UserDefinition.name));
    jwtService = testModule.get<JwtService>(JwtService);

    await userModel.create(userData);
  });

  afterEach(async () => {
    await app.close();
    await testModule.close();
    await mongoServer.stop();
  });

  describe('POST /auth', () => {
    it('should return a JWT token when login is correct', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth')
        .send({ email: userData.email, password: 'password' })
        .expect(200);

      expect(response.body).toHaveProperty('token');

      const payload = await jwtService.verifyAsync(
        response.body.token as string
      );

      expect(payload.userId).toEqual(userData.id);
    });

    it('should return 401 when password is incorrect', async () => {
      await supertest(app.getHttpServer())
        .post('/auth')
        .send({ email: userData.email, password: 'wrong-password' })
        .expect(401);
    });

    it('should return 401 when email is incorrect', async () => {
      await supertest(app.getHttpServer())
        .post('/auth')
        .send({ email: `wrong${userData.email}`, password: 'password' })
        .expect(401);
    });

    it('should return 400 when email invalid', async () => {
      await supertest(app.getHttpServer())
        .post('/auth')
        .send({ email: 'invalid email', password: 'password' })
        .expect(400);
    });

    it('should return 400 when email is missing', async () => {
      await supertest(app.getHttpServer())
        .post('/auth')
        .send({ password: 'password' })
        .expect(400);
    });

    it('should return 400 when password is missing', async () => {
      await supertest(app.getHttpServer())
        .post('/auth')
        .send({ email: userData.email })
        .expect(400);
    });
  });
});
