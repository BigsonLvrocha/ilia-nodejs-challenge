import { MongoMemoryServer } from 'mongodb-memory-server';
import { type TestingModule, Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { describe, beforeEach, it, expect, afterEach } from '@jest/globals';

import { TransactionsModule } from '../transactions.module.js';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';
import { type MongooseTransactionService } from './mongoose-transaction-service.js';
import {
  TransactionDefinition,
  type TransactionModel,
} from './models/transaction.schema.js';
import { Transaction } from '../domain/transactions.js';
import { TransactionType } from '../domain/transaction-type.enum.js';
import { v4 as uuid } from 'uuid';

describe('MongooseTransactionService', () => {
  let module: TestingModule;
  let server: MongoMemoryServer;
  let transactionService: MongooseTransactionService;
  let transactionModel: TransactionModel;

  beforeEach(async () => {
    server = await MongoMemoryServer.create();
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(server.getUri()),
        TransactionsModule,
      ],
    }).compile();

    transactionService = module.get<MongooseTransactionService>(
      TransactionProviderEnum.TransactionService
    );

    transactionModel = module.get<TransactionModel>(
      getModelToken(TransactionDefinition.name)
    );
  });

  afterEach(async () => {
    await module.close();
    await server.stop();
  });

  describe('create', () => {
    it('creates a transaction', async () => {
      const transaction = new Transaction({
        amount: 100,
        type: TransactionType.CREDIT,
        userId: uuid(),
      });
      await transactionService.create(transaction);

      const createdTransaction = await transactionModel.findOne({
        id: transaction.id,
      });

      expect(createdTransaction).toBeDefined();
    });
  });
});
