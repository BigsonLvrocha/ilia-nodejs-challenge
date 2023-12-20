import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { providersEnum } from '../providers.enum.js';
import { User } from '../domain/user.js';
import { UpdateUserUseCase } from './update-user-use-case.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';

describe('UpdateUserUseCase', () => {
  const userRepositoryMockFactory = (): {
    update: jest.Mock<() => Promise<void>>;
    findById: jest.Mock<() => Promise<User | null>>;
  } => ({
    update: jest.fn(),
    findById: jest.fn(),
  });

  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
  let useCase: UpdateUserUseCase;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: providersEnum.UserRepository,
          useFactory: userRepositoryMockFactory,
        },
      ],
    }).compile();

    useCase = testModule.get(UpdateUserUseCase);
    userRepositoryMock = testModule.get(providersEnum.UserRepository);
  });

  it('updates user via repository', async () => {
    const user = await User.createNewUser({
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });

    userRepositoryMock.findById.mockResolvedValueOnce(user);

    await useCase.execute({
      userId: user.id,
      data: {
        firstName: 'John2',
        email: 'john2@gmail.com',
        password: 'password2',
      },
    });

    expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
  });

  it('throws error when user is not found', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        userId: '123',
        data: {
          firstName: 'John2',
          email: 'john@gmail.com',
          password: 'password2',
        },
      })
    ).rejects.toThrowError(UserNotFoundException);
  });
});
