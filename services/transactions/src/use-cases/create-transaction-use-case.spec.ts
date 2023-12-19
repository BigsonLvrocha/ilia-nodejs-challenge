import { describe, beforeEach, jest, it, expect } from '@jest/globals';
import { Test, type TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction-use-case.js';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';
import { v4 as uuid } from 'uuid';
import { Transaction } from '../domain/transactions.js';
import { TransactionType } from '../domain/transaction-type.enum.js';

describe('CreateTransactionUseCase', () => {
  const transactionMockFactory = (): { create: jest.Mock } => ({
    create: jest.fn(),
  });
  let transactionMock: ReturnType<typeof transactionMockFactory>;
  let module: TestingModule;
  let useCase: CreateTransactionUseCase;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TransactionProviderEnum.TransactionService,
          useFactory: transactionMockFactory,
        },
      ],
    }).compile();

    transactionMock = module.get(TransactionProviderEnum.TransactionService);
    useCase = module.get(CreateTransactionUseCase);
  });

  it('creates the transaction using the repository', async () => {
    const requestDto = {
      amount: 100,
      type: TransactionType.CREDIT,
      userId: uuid(),
    };
    const response = await useCase.execute(requestDto);

    expect(response.userId).toBe(requestDto.userId);
    expect(response.amount).toBe(requestDto.amount);
    expect(response.type).toBe(requestDto.type);

    expect(transactionMock.create).toHaveBeenCalled();

    const transaction = transactionMock.create.mock.calls[0][0];
    expect(transaction).toBeInstanceOf(Transaction);
  });
});
