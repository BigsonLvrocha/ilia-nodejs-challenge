import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { providersEnum } from '../providers.enum.js';
import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user-use-case.js';
import { User } from '../domain/user.js';

describe('create user use case', () => {
  const userRepositoryMockFactory = (): {
    create: jest.Mock;
  } => ({
    create: jest.fn(),
  });

  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
  let useCase: CreateUserUseCase;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: providersEnum.UserRepository,
          useFactory: userRepositoryMockFactory,
        },
      ],
    }).compile();

    userRepositoryMock = testModule.get(providersEnum.UserRepository);
    useCase = testModule.get(CreateUserUseCase);
  });

  it('creates a user via repository', async () => {
    await useCase.execute({
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });

    expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);

    const user = userRepositoryMock.create.mock.calls[0][0];
    expect(user).toBeInstanceOf(User);
  });
});
