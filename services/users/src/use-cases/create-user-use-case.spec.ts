import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { providersEnum } from '../providers.enum.js';
import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user-use-case.js';
import { User } from '../domain/user.js';
import { UserEmailTakenException } from '../domain/error/user-email-taken-exception.js';

describe('create user use case', () => {
  const userRepositoryMockFactory = (): {
    create: jest.Mock;
    findByEmail: jest.Mock<() => Promise<User | null>>;
  } => ({
    create: jest.fn(),
    findByEmail: jest.fn(async () => null),
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
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);

    const user = userRepositoryMock.create.mock.calls[0][0];
    expect(user).toBeInstanceOf(User);
  });

  it('throws error when user email already taken', async () => {
    const user = await User.createNewUser({
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });

    userRepositoryMock.findByEmail.mockResolvedValueOnce(user);

    await expect(
      useCase.execute({
        email: 'john@gmail.com',
        firstName: 'John2',
        lastName: 'Doe2',
        password: 'password2',
      })
    ).rejects.toThrowError(UserEmailTakenException);
  });
});
