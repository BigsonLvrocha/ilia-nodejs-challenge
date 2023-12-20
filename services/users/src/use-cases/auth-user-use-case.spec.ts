import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { User } from '../domain/user.js';
import { Test } from '@nestjs/testing';
import { providersEnum } from '../providers.enum.js';
import { UserAuthFailedException } from '../domain/error/user-auth-failed-exception.js';
import { AuthUserUseCase } from './auth-user-use-case.js';

describe('AuthUserUseCase', () => {
  const userRepositoryMockFactory = (): {
    findByEmail: jest.Mock<() => Promise<User | null>>;
  } => ({
    findByEmail: jest.fn(async () => null),
  });

  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
  let useCase: AuthUserUseCase;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        AuthUserUseCase,
        {
          provide: providersEnum.UserRepository,
          useFactory: userRepositoryMockFactory,
        },
      ],
    }).compile();

    userRepositoryMock = testModule.get(providersEnum.UserRepository);
    useCase = testModule.get(AuthUserUseCase);
  });

  it('throws error when user is not found', async () => {
    await expect(
      useCase.execute({
        email: 'john@gmail.com',
        password: 'password',
      })
    ).rejects.toThrowError(UserAuthFailedException);

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'john@gmail.com'
    );
  });

  it('throws error when password is incorrect', async () => {
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
        password: 'password2',
      })
    ).rejects.toThrowError(UserAuthFailedException);
  });

  it('returns user id when auth is successful', async () => {
    const user = await User.createNewUser({
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });

    userRepositoryMock.findByEmail.mockResolvedValueOnce(user);

    const response = await useCase.execute({
      email: 'john@gmail.com',
      password: 'password',
    });

    expect(response).toEqual({ userId: user.id });
  });
});
