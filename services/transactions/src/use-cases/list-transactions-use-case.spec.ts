import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, type TestingModule } from '@nestjs/testing';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';
import { v4 as uuid } from 'uuid';
import { TransactionType } from '../domain/transaction-type.enum.js';
import { Transaction } from '../domain/transactions.js';
import { ListTransactionsUseCase } from './list-transactions-use-case.js';

describe('ListTransactionsUseCase', () => {
  const transactionServiceMockFactory = (): {
    find: jest.Mock<() => Promise<Transaction[]>>;
  } => ({
    find: jest.fn(async () => await Promise.resolve([] as Transaction[])),
  });
  let useCase: ListTransactionsUseCase;

  let transactionServiceMock: ReturnType<typeof transactionServiceMockFactory>;

  const userId = uuid();

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        ListTransactionsUseCase,
        {
          provide: TransactionProviderEnum.TransactionService,
          useFactory: transactionServiceMockFactory,
        },
      ],
    }).compile();

    useCase = testModule.get(ListTransactionsUseCase);
    transactionServiceMock = testModule.get(
      TransactionProviderEnum.TransactionService
    );
  });

  it('returns the transactions', async () => {
    const transactions = [
      new Transaction({
        id: uuid(),
        userId,
        amount: 100,
        type: TransactionType.CREDIT,
        timestamp: new Date(),
      }),
      new Transaction({
        id: uuid(),
        userId,
        amount: 100,
        type: TransactionType.CREDIT,
        timestamp: new Date(),
      }),
    ];
    transactionServiceMock.find.mockResolvedValue(transactions);

    const response = await useCase.execute({ userId });

    expect(response).toStrictEqual({
      transactions: [
        {
          id: transactions[0].id,
          userId,
          amount: 100,
          type: TransactionType.CREDIT,
        },
        {
          id: transactions[1].id,
          userId,
          amount: 100,
          type: TransactionType.CREDIT,
        },
      ],
    });
    expect(transactionServiceMock.find).toHaveBeenCalled();
  });
});
