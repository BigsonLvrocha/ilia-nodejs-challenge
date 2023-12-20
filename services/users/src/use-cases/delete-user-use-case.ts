import { Inject, Injectable } from '@nestjs/common';
import { providersEnum } from '../providers.enum.js';
import { UserRepositoryInterface } from '../domain/user-repository-interface.js';
import { type UseCaseInterface } from './use-case-interface.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';
import { UserHashBalanceException } from '../domain/error/user-has-balance-exception.js';
import { TransactionsServiceInterface } from '../domain/transactions-service-interface.js';

interface DeleteUserUseCaseRequest {
  id: string;
}

type DeleteUserUseCaseResponse = undefined;

@Injectable()
export class DeleteUserUseCase
  implements
    UseCaseInterface<DeleteUserUseCaseRequest, DeleteUserUseCaseResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface,

    @Inject(providersEnum.TransactionsService)
    private readonly transactionsService: TransactionsServiceInterface
  ) {}

  async execute(request: DeleteUserUseCaseRequest): Promise<undefined> {
    const user = await this.userRepository.findById(request.id);

    if (user === null) {
      throw new UserNotFoundException();
    }

    const balance = await this.transactionsService.getBalance(user.id);

    if (balance !== 0) {
      throw new UserHashBalanceException();
    }

    await this.userRepository.delete(user);
  }
}
