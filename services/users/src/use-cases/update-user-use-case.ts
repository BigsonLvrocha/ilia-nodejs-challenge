import { Inject } from '@nestjs/common';
import { type UseCaseInterface } from './use-case-interface.js';
import { providersEnum } from '../providers.enum.js';
import { UserRepositoryInterface } from '../domain/user-repository-interface.js';

interface UpdateUserUseCaseRequest {
  userId: string;
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
}

interface UpdateUserUseCaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class UpdateUserUseCase
  implements
    UseCaseInterface<UpdateUserUseCaseRequest, UpdateUserUseCaseResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(
    request: UpdateUserUseCaseRequest
  ): Promise<UpdateUserUseCaseResponse> {
    const user = await this.userRepository.findById(request.userId);

    if (user === null) {
      throw new Error('User not found');
    }

    if (request.data.firstName !== undefined) {
      user.changeFirstName(request.data.firstName);
    }

    if (request.data.lastName !== undefined) {
      user.changeLastName(request.data.lastName);
    }

    if (request.data.email !== undefined) {
      user.changeEmail(request.data.email);
    }

    if (request.data.password !== undefined) {
      await user.changePassword(request.data.password);
    }

    await this.userRepository.update(user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
