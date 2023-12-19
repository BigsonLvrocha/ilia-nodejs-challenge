import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TransactionsPublicApiModule } from './transactions-public-api.module.js';
import { type INestApplication } from '@nestjs/common';
import {
  TransactionDefinition,
  type TransactionModel,
} from '../../infrastructure/models/transaction.schema.js';
import { v4 as uuid } from 'uuid';
import { AuthModule } from './auth/auth.module.js';

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
        AuthModule,
        TransactionsPublicApiModule,
      ],
    }).compile();
    app = testModule.createNestApplication();

    transactionModel = testModule.get(
      getModelToken(TransactionDefinition.name)
    );
    const configService = testModule.get(ConfigService);
    jwtToken = jwt.sign(
      { userId },
      configService.get('PUBLIC_API_JWT_SECRET') ?? 'ILIACHALLENGE',
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
  });
});
