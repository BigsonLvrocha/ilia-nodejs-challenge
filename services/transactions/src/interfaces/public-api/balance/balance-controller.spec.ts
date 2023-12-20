import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { describe, beforeEach, it, expect, afterEach } from '@jest/globals';
import { type NestApplication } from '@nestjs/core';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  TransactionDefinition,
  type TransactionModel,
} from '../../../infrastructure/models/transaction.schema.js';
import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';
import { TransactionsPublicApiModule } from '../transactions-public-api.module.js';
import { ValidationPipe } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('BalanceController', () => {
  let mongoServer: MongoMemoryServer;
  let testApp: NestApplication;
  let jwtToken: string;
  let transactionModel: TransactionModel;
  let testModule: TestingModule;
  const userId = uuid();

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();

    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(mongoServer.getUri()),
        AuthModule,
        TransactionsPublicApiModule,
      ],
    }).compile();
    testApp = testModule.createNestApplication();
    testApp.useGlobalPipes(new ValidationPipe());

    transactionModel = testModule.get(
      getModelToken(TransactionDefinition.name)
    );
    const configService = testModule.get(ConfigService);
    jwtToken = jwt.sign(
      { userId },
      configService.get('PUBLIC_API_JWT_SECRET') ?? 'default-secret',
      { expiresIn: '1h' }
    );

    await testApp.init();
    await testApp.init();
  });

  afterEach(async () => {
    await mongoServer.stop();
    await testModule.close();
    await testApp.close();
  });

  describe('GET /balance', () => {
    it('returns the balance', async () => {
      await transactionModel.create({
        id: uuid(),
        userId,
        balanceChange: 100,
        timestamp: new Date(),
      });
      await transactionModel.create({
        id: uuid(),
        userId,
        balanceChange: -30,
        timestamp: new Date(),
      });

      const response = await supertest(testApp.getHttpServer())
        .get('/balance')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toStrictEqual({ amount: 70 });
    });
  });
});
