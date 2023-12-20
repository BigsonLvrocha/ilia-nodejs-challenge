import { Inject } from '@nestjs/common';
import { type UseCaseInterface } from './use-case-interface.js';
import { providersEnum } from '../providers.enum.js';
import { UserRepositoryInterface } from '../domain/user-repository-interface.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';

interface ReadUserUseCaseRequest {
  userId: string;
}

interface ReadUserUseCaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class ReadUserUseCase
  implements UseCaseInterface<ReadUserUseCaseRequest, ReadUserUseCaseResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(
    request: ReadUserUseCaseRequest
  ): Promise<ReadUserUseCaseResponse> {
    const user = await this.userRepository.findById(request.userId);

    if (user === null) {
      throw new UserNotFoundException();
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
