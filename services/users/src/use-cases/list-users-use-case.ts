import { Injectable, Inject } from '@nestjs/common';
import { type UseCaseInterface } from './use-case-interface.js';
import { providersEnum } from '../providers.enum.js';
import { UserRepositoryInterface } from '../domain/user-repository-interface.js';

interface ListUsersUseCaseResponse {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

Injectable();
export class ListUsersUseCase
  implements UseCaseInterface<undefined, ListUsersUseCaseResponse>
{
  constructor(
    @Inject(providersEnum.UserRepository)
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute(): Promise<ListUsersUseCaseResponse> {
    const users = await this.userRepository.findAll();
    return {
      users: users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      })),
    };
  }
}
