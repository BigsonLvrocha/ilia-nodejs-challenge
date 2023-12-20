import { Inject } from '@nestjs/common';
import { providersEnum } from '../providers.enum.js';
import { UserRepositoryInterface } from '../domain/user-repository-interface.js';
import { type UseCaseInterface } from './use-case-interface.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';

interface DeleteUserUseCaseRequest {
  id: string;
}

type DeleteUserUseCaseResponse = undefined;

export class DeleteUserUseCase
  implements
    UseCaseInterface<DeleteUserUseCaseRequest, DeleteUserUseCaseResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(request: DeleteUserUseCaseRequest): Promise<undefined> {
    const user = await this.userRepository.findById(request.id);

    if (user === null) {
      throw new UserNotFoundException();
    }

    await this.userRepository.delete(user);
  }
}
