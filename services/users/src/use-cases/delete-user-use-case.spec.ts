import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { providersEnum } from '../providers.enum.js';
import { Test } from '@nestjs/testing';
import { User } from '../domain/user.js';
import { DeleteUserUseCase } from './delete-user-use-case.js';
import { UserNotFoundException } from '../domain/error/user-not-found-exception.js';

describe('delete user use case', () => {
  const userRepositoryMockFactory = (): {
    delete: jest.Mock;
    findById: jest.Mock<() => Promise<User | null>>;
  } => ({
    delete: jest.fn(),
    findById: jest.fn(async () => null),
  });

  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
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
      ],
    }).compile();

    userRepositoryMock = testModule.get(providersEnum.UserRepository);
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
  });

  it('throws error when user is not found', async () => {
    userRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: user.id })).rejects.toThrowError(
      UserNotFoundException
    );
  });
});
