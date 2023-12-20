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
  });
});
