import { Inject, Injectable } from '@nestjs/common';
import { TransactionServiceInterface } from '../domain/transaction-service-interface.js';
import { TransactionProviderEnum } from '../transactions-providers.enum.js';
import { type UseCase } from '../use-case.js';

interface GetBalanceUseCaseDto {
  userId: string;
}

interface GetBalanceUseCaseResponse {
  amount: number;
}

@Injectable()
export class GetBalanceUseCase
  implements UseCase<GetBalanceUseCaseDto, GetBalanceUseCaseResponse>
{
  constructor(
    @Inject(TransactionProviderEnum.TransactionService)
    private readonly transactionService: TransactionServiceInterface
  ) {}

  async execute(
    requestDto: GetBalanceUseCaseDto
  ): Promise<GetBalanceUseCaseResponse> {
    const { userId } = requestDto;
    const amount = await this.transactionService.getBalance(userId);
    return {
      amount,
    };
  }
}
