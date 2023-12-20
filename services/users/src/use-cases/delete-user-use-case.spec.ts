import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { providersEnum } from '../providers.enum.js';
import { Test } from '@nestjs/testing';
import { User } from '../domain/user.js';
import { DeleteUserUseCase } from './delete-user-use-case.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';
import { UserHashBalanceException } from '../domain/error/user-has-balance-exception.js';

describe('delete user use case', () => {
  const userRepositoryMockFactory = (): {
    delete: jest.Mock;
    findById: jest.Mock<() => Promise<User | null>>;
  } => ({
    delete: jest.fn(),
    findById: jest.fn(async () => null),
  });

  const transactionsServiceMockFactory = (): {
    getBalance: jest.Mock<() => Promise<number>>;
  } => ({
    getBalance: jest.fn(async () => 0),
  });

  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
  let transactionsServiceMock: ReturnType<
    typeof transactionsServiceMockFactory
  >;
  let useCase: DeleteUserUseCase;
  let user: User;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: providersEnum.UserRepository,
          useFactory: userRepositoryMockFactory,
        },
        {
          provide: providersEnum.TransactionsService,
          useFactory: transactionsServiceMockFactory,
        },
      ],
    }).compile();

    userRepositoryMock = testModule.get(providersEnum.UserRepository);
    transactionsServiceMock = testModule.get(providersEnum.TransactionsService);
    useCase = testModule.get(DeleteUserUseCase);
    user = await User.createNewUser({
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    });
  });

  it('deletes a user via repository', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(user);

    await useCase.execute({ id: user.id });

    expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(user);
    expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(user.id);
    expect(transactionsServiceMock.getBalance).toHaveBeenCalledTimes(1);
    expect(transactionsServiceMock.getBalance).toHaveBeenCalledWith(user.id);
  });

  it('throws error when user is not found', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: user.id })).rejects.toThrowError(
      UserNotFoundException
    );
  });

  it('throws eror when user has balance', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(user);
    transactionsServiceMock.getBalance.mockResolvedValueOnce(100);

    await expect(useCase.execute({ id: user.id })).rejects.toThrowError(
      UserHashBalanceException
    );
  });
});
