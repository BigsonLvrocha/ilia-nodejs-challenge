import { Inject, Injectable } from '@nestjs/common';
import { TransactionServiceInterface } from '../domain/transaction-service-interface.js';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';
import { type TransactionType } from '../domain/transaction-type.enum.js';
import { type UseCase } from '../use-case.js';

interface ListTransactionsUseCaseDto {
  userId: string;
  type?: TransactionType;
}

interface ListTransactionsUseCaseResponse {
  transactions: Array<{
    userId: string;
    amount: number;
    type: TransactionType;
    id: string;
  }>;
}
@Injectable()
export class ListTransactionsUseCase
  implements
    UseCase<ListTransactionsUseCaseDto, ListTransactionsUseCaseResponse>
{
  constructor(
    @Inject(TransactionProviderEnum.TransactionService)
    private readonly transactionService: TransactionServiceInterface
  ) {}

  async execute(
    requestDto: ListTransactionsUseCaseDto
  ): Promise<ListTransactionsUseCaseResponse> {
    const transactions = await this.transactionService.find(requestDto);
    return {
      transactions: transactions.map((transaction) => ({
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type,
        id: transaction.id,
      })),
    };
  }
}
