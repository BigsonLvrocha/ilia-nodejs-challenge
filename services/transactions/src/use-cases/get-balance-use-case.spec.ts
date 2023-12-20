import { describe, beforeEach, jest, it, expect } from '@jest/globals';

import { Test, type TestingModule } from '@nestjs/testing';
import { GetBalanceUseCase } from './get-balance-use-case.js';
import { v4 as uuid } from 'uuid';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';

describe('GetBalanceUseCase', () => {
  const transactionServiceMockFactory = (): {
    getBalance: jest.Mock<() => Promise<number>>;
  } => ({
    getBalance: jest.fn(async () => await Promise.resolve(3)),
  });

  let useCase: GetBalanceUseCase;
  let transactionServiceMock: ReturnType<typeof transactionServiceMockFactory>;

  const userId = uuid();

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        GetBalanceUseCase,
        {
          provide: TransactionProviderEnum.TransactionService,
          useFactory: transactionServiceMockFactory,
        },
      ],
    }).compile();

    useCase = testModule.get(GetBalanceUseCase);
    transactionServiceMock = testModule.get(
      TransactionProviderEnum.TransactionService
    );
  });

  it('uses the transaction service to get the balance', async () => {
    const result = await useCase.execute({ userId });

    expect(transactionServiceMock.getBalance).toHaveBeenCalledWith(userId);
    expect(result).toStrictEqual({ amount: 3 });
  });
});
