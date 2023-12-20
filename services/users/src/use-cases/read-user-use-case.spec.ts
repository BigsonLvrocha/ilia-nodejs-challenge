import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { providersEnum } from '../providers.enum.js';
import { Test } from '@nestjs/testing';
import { User } from '../domain/user.js';
import { ReadUserUseCase } from './read-user-use-case.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';

describe('read user use case', () => {
  const userRepositoryMockFactory = (): {
    findById: jest.Mock<() => Promise<User | null>>;
  } => ({
    findById: jest.fn(async () => await Promise.resolve(null)),
  });

  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
  let useCase: ReadUserUseCase;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        ReadUserUseCase,
        {
          provide: providersEnum.UserRepository,
          useFactory: userRepositoryMockFactory,
        },
      ],
    }).compile();

    userRepositoryMock = testModule.get(providersEnum.UserRepository);
    useCase = testModule.get(ReadUserUseCase);
  });

  it('reads a user via repository', async () => {
    const userToRead = await User.createNewUser({
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });

    userRepositoryMock.findById.mockResolvedValueOnce(userToRead);

    const userRead = await useCase.execute({ userId: userToRead.id });

    expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(userRead).toEqual({
      id: userToRead.id,
      firstName: userToRead.firstName,
      lastName: userToRead.lastName,
      email: userToRead.email,
    });
  });

  it('throw error when user is not found', async () => {
    await expect(useCase.execute({ userId: '123' })).rejects.toThrowError(
      UserNotFoundException
    );
  });
});
