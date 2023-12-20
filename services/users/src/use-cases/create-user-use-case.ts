import { Inject, Injectable } from '@nestjs/common';
import { type UserRepositoryInterface } from '../domain/user-repository-interface.js';
import { User } from '../domain/user.js';
import { type UseCaseInterface } from './use-case-interface.js';
import { providersEnum } from '../providers.enum.js';

interface CreateUserUseCaseRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase
  implements
    UseCaseInterface<CreateUserUseCaseRequest, CreateUserUseCaseResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(
    request: CreateUserUseCaseRequest
  ): Promise<CreateUserUseCaseResponse> {
    const user = await User.createNewUser(request);
    await this.userRepository.create(user);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
