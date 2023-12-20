import supertest from 'supertest';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PublicApiModule } from '../public-api.module.js';
import {
  UserDefinition,
  type UserModel,
} from '../../../infrastructure/model/user.schema.js';
import { v4 as uuid } from 'uuid';

describe('UserController', () => {
  let mongoServer: MongoMemoryServer;
  let testModule: TestingModule;
  let app: INestApplication;
  let jwtService: JwtService;
  let userModel: UserModel;

  const user = {
    id: uuid(),
    firstName: 'Api',
    lastName: 'User',
    email: 'apiuser@gmail.com',
    passwordHash: 'password',
  };

  let userToken: string;

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
        PublicApiModule,
      ],
    }).compile();

    app = testModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    userModel = testModule.get<UserModel>(getModelToken(UserDefinition.name));
    jwtService = testModule.get<JwtService>(JwtService);

    await userModel.create(user);
    userToken = await jwtService.signAsync({ userId: user.id });
  });

  afterEach(async () => {
    await app.close();
    await testModule.close();
    await mongoServer.stop();
  });

  describe('GET /users', () => {
    const usersData = [
      {
        id: uuid(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        passwordHash: 'password',
      },
      {
        id: uuid(),
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@gmail.com',
        passwordHash: 'password2',
      },
    ];

    beforeEach(async () => {
      await userModel.create(usersData);
    });

    it('returns all users', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
    });

    it('returns 401 when token is not provided', async () => {
      await supertest(app.getHttpServer()).get('/users').expect(401);
    });
  });
});
