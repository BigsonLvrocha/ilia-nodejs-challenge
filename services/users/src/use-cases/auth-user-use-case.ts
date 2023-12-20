import { Inject, Injectable } from '@nestjs/common';
import { UserAuthFailedException } from '../domain/error/user-auth-failed-exception.js';
import { type UserRepositoryInterface } from '../domain/user-repository-interface.js';
import { type UseCaseInterface } from './use-case-interface.js';
import { providersEnum } from '../providers.enum.js';

interface AuthUserRequest {
  email: string;
  password: string;
}

type AuthUserResponse = undefined;

@Injectable()
export class AuthUserUseCase
  implements UseCaseInterface<AuthUserRequest, AuthUserResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(request: AuthUserRequest): Promise<AuthUserResponse> {
    const user = await this.userRepository.findByEmail(request.email);

    if (user === null) {
      throw new UserAuthFailedException();
    }

    const validPassword = await user.checkPassword(request.password);

    if (!validPassword) {
      throw new UserAuthFailedException();
    }
  }
}
