import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TransactionsPublicApiModule } from '../transactions-public-api.module.js';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import {
  TransactionDefinition,
  type TransactionModel,
} from '../../../infrastructure/models/transaction.schema.js';
import { v4 as uuid } from 'uuid';

describe('TransactionsController', () => {
  const userId = uuid();
  let jwtToken: string;
  let app: INestApplication;
  let testModule: TestingModule;
  let server: MongoMemoryServer;
  let transactionModel: TransactionModel;

  beforeEach(async () => {
    server = await MongoMemoryServer.create();
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(server.getUri()),
        TransactionsPublicApiModule,
      ],
    }).compile();
    app = testModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    transactionModel = testModule.get(
      getModelToken(TransactionDefinition.name)
    );
    const configService = testModule.get(ConfigService);
    jwtToken = jwt.sign(
      { userId },
      configService.get('PUBLIC_API_JWT_SECRET') ?? 'default-secret',
      { expiresIn: '1h' }
    );

    await app.init();
  });

  afterEach(async () => {
    await server.stop();
    await testModule.close();
    await app.close();
  });

  describe('POST /transactions', () => {
    it('creates the transaction', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/transactions')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          amount: 100,
          type: 'CREDIT',
          userId,
        })
        .expect(200);

      expect(response.body).toEqual({
        id: expect.any(String),
        amount: 100,
        type: 'CREDIT',
        user_id: userId,
      });

      const transactionsInDb = await transactionModel.find({
        userId,
      });

      expect(transactionsInDb).toHaveLength(1);
      expect(transactionsInDb[0].balanceChange).toBe(100);
    });

    it('returns 401 if the token is invalid', async () => {
      await supertest(app.getHttpServer())
        .post('/transactions')
        .set('Accept', 'application/json')
        .send({
          amount: 100,
          type: 'CREDIT',
          userId,
        })
        .expect(401);
    });

    it('returns 400 if type is not CREDIT nor DEBIT', async () => {
      await supertest(app.getHttpServer())
        .post('/transactions')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          amount: 100,
          type: 'CREDITA',
          userId,
        })
        .expect(400);
    });

    it('returns 400 if amount is not int', async () => {
      await supertest(app.getHttpServer())
        .post('/transactions')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          amount: 100.1,
          type: 'CREDIT',
          userId,
        })
        .expect(400);
    });

    it('returns 400 if amount is not positive', async () => {
      await supertest(app.getHttpServer())
        .post('/transactions')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          amount: -100,
          type: 'CREDIT',
          userId,
        })
        .expect(400);
    });
  });

  describe('POST /transactions', () => {
    const transactions = [
      {
        id: uuid(),
        userId,
        balanceChange: 100,
        timestamp: new Date(),
      },
      {
        id: uuid(),
        userId,
        balanceChange: 100,
        timestamp: new Date(),
      },
      {
        id: uuid(),
        userId,
        balanceChange: -100,
        timestamp: new Date(),
      },
    ];

    beforeEach(async () => {
      await transactionModel.create(transactions);
    });

    it('returns the transactions', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
    });

    it('throws 400 if type is invalid', async () => {
      await supertest(app.getHttpServer())
        .get('/transactions')
        .query({ type: 'INVALID' })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(400);
    });

    it('returns only debit transactions', async () => {
      const result = await supertest(app.getHttpServer())
        .get('/transactions')
        .query({ type: 'DEBIT' })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(result.body).toHaveLength(1);
      expect(result.body[0].id).toBe(transactions[2].id);
    });

    it('returns 401 when auth token is invalid', async () => {
      await supertest(app.getHttpServer())
        .get('/transactions')
        .query({ type: 'DEBIT' })
        .set('Authorization', `Bearer ${jwtToken}-invalid`)
        .expect(401);
    });
  });
});
