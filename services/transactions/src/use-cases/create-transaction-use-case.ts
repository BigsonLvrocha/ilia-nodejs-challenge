import { Inject } from '@nestjs/common';
import { type TransactionType } from '../domain/transaction-type.enum.js';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';
import { TransactionServiceInterface } from '../domain/transaction-service-interface.js';
import { Transaction } from '../domain/transactions.js';
import { type UseCase } from '../use-case.js';

interface CreateTransactionUseCaseDto {
  userId: string;
  amount: number;
  type: TransactionType;
}

interface CreateTransactionUseCaseResponse {
  userId: string;
  amount: number;
  type: TransactionType;
}

export class CreateTransactionUseCase
  implements
    UseCase<CreateTransactionUseCaseDto, CreateTransactionUseCaseResponse>
{
  constructor(
    @Inject(TransactionProviderEnum.TransactionService)
    private readonly transactionService: TransactionServiceInterface
  ) {}

  async execute(
    requestDto: CreateTransactionUseCaseDto
  ): Promise<CreateTransactionUseCaseResponse> {
    const transaction = new Transaction({
      amount: requestDto.amount,
      type: requestDto.type,
      userId: requestDto.userId,
    });

    await this.transactionService.create(transaction);

    return {
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type,
    };
  }
}
