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
      expect(createdTransaction?.id).toBe(transaction.id);
      expect(createdTransaction?.balanceChange).toBe(transaction.balanceChange);
      expect(createdTransaction?.timestamp).toStrictEqual(
        transaction.timestamp
      );
      expect(createdTransaction?.userId).toBe(transaction.userId);
    });
  });

  describe('find', () => {
    const userId = uuid();

    const transactionsInDb = [
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
      {
        id: uuid(),
        userId: uuid(),
        balanceChange: 100,
        timestamp: new Date(),
      },
    ];

    beforeEach(async () => {
      await transactionModel.create(transactionsInDb);
    });

    it('finds all transactions for a user', async () => {
      const transactions = await transactionService.find({
        userId,
      });

      expect(transactions).toHaveLength(2);

      const transaction0 = transactions.find(
        (t) => t.id === transactionsInDb[0].id
      );
      expect(transaction0).toBeDefined();
      expect(transaction0?.type).toBe(TransactionType.CREDIT);
      expect(transaction0?.amount).toBe(100);

      const transaction1 = transactions.find(
        (t) => t.id === transactionsInDb[1].id
      );
      expect(transaction1).toBeDefined();
      expect(transaction1?.type).toBe(TransactionType.DEBIT);
      expect(transaction1?.amount).toBe(100);
    });

    it('filters by type', async () => {
      const transactions = await transactionService.find({
        userId,
        type: TransactionType.CREDIT,
      });

      expect(transactions).toHaveLength(1);

      const transaction = transactions[0];
      expect(transaction.id).toBe(transactionsInDb[0].id);
      expect(transaction.type).toBe(TransactionType.CREDIT);
      expect(transaction.amount).toBe(100);
    });
  });

  describe('getBalance', () => {
    const userId = uuid();

    const transactionsInDb = [
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
      {
        id: uuid(),
        userId: uuid(),
        balanceChange: 100,
        timestamp: new Date(),
      },
    ];

    beforeEach(async () => {
      await transactionModel.create(transactionsInDb);
    });

    it('gets the total balance for userId', async () => {
      const balance = await transactionService.getBalance(userId);

      expect(balance).toEqual(0);
    });

    it('gets the positive total balance for userId', async () => {
      await transactionModel.create({
        balanceChange: 30,
        id: uuid(),
        timestamp: new Date(),
        userId,
      });
      const balance = await transactionService.getBalance(userId);

      expect(balance).toEqual(30);
    });

    it('gets the negative total balance for userId', async () => {
      await transactionModel.create({
        balanceChange: -30,
        id: uuid(),
        timestamp: new Date(),
        userId,
      });
      const balance = await transactionService.getBalance(userId);

      expect(balance).toEqual(-30);
    });
  });
});
