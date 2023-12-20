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

  describe('POST /users', () => {
    it('creates a new user', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/users')
        .send({
          email: 'john@gmail.com',
          first_name: 'John',
          last_name: 'Doe',
          password: 'strongPasswordPassingTHrough00!',
        })
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'john@gmail.com');
      expect(response.body).toHaveProperty('first_name', 'John');
      expect(response.body).toHaveProperty('last_name', 'Doe');

      const userInDb = await userModel.findOne({ id: response.body.id }).exec();
      expect(userInDb).not.toBeNull();
    });

    it('returns 400 when password is weak', async () => {
      await supertest(app.getHttpServer())
        .post('/users')
        .send({
          email: 'john@gmail.com',
          first_name: 'John',
          last_name: 'Doe',
          password: 'password',
        })
        .expect(400);
    });

    it('returns 400 when email is invalid', async () => {
      await supertest(app.getHttpServer())
        .post('/users')
        .send({
          email: 'john',
          first_name: 'John',
          last_name: 'Doe',
          password: 'strongPasswordPassingTHrough00!',
        })
        .expect(400);
    });

    it('returns 400 when email is missing', async () => {
      await supertest(app.getHttpServer())
        .post('/users')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          password: 'strongPasswordPassingTHrough00!',
        })
        .expect(400);
    });
  });

  describe('GET /users/:id', () => {
    it('returns user when user is found', async () => {
      const response = await supertest(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('first_name', user.firstName);
      expect(response.body).toHaveProperty('last_name', user.lastName);
    });

    it('returns 404 when user is not found', async () => {
      await supertest(app.getHttpServer())
        .get(`/users/${uuid()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });

    it('returns 401 when token is not provided', async () => {
      await supertest(app.getHttpServer()).get(`/users/${uuid()}`).expect(401);
    });
  });

  describe('PATCH /users/:id', () => {
    it('updates user when user is found', async () => {
      const response = await supertest(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('first_name', 'Jane');
      expect(response.body).toHaveProperty('last_name', 'Doe');

      const userInDB = await userModel.findOne({ id: user.id }).exec();
      expect(userInDB).toHaveProperty('firstName', 'Jane');
    });

    it('returns 404 when user is not found', async () => {
      const newUserId = uuid();
      const newUserToken = await jwtService.signAsync({ userId: newUserId });
      await supertest(app.getHttpServer())
        .patch(`/users/${newUserId}`)
        .set('Authorization', `Bearer ${newUserToken}`)
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
        })
        .expect(404);
    });

    it('returns 401 when token is not provided', async () => {
      await supertest(app.getHttpServer())
        .patch(`/users/${uuid()}`)
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
        })
        .expect(401);
    });

    it('return 401 id is not the same as user id', async () => {
      await supertest(app.getHttpServer())
        .patch(`/users/${uuid()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          first_name: 'Jane',
          last_name: 'Doe',
        })
        .expect(401);
    });
  });
});
