import { Test } from '@nestjs/testing';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { ListUsersUseCase } from './list-users-use-case.js';
import { providersEnum } from '../providers.enum.js';
import { User } from '../domain/user.js';

describe('ListUsersUseCase', () => {
  const userRepositoryMockFactory = (): {
    findAll: jest.Mock<() => Promise<User[]>>;
  } => ({
    findAll: jest.fn(),
  });
  let userRepositoryMock: ReturnType<typeof userRepositoryMockFactory>;
  let useCase: ListUsersUseCase;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        ListUsersUseCase,
        {
          provide: providersEnum.UserRepository,
          useFactory: userRepositoryMockFactory,
        },
      ],
    }).compile();

    userRepositoryMock = testModule.get(providersEnum.UserRepository);
    useCase = testModule.get(ListUsersUseCase);
  });

  it('list users via repository', async () => {
    const users = [
      await User.createNewUser({
        email: 'john@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      }),
    ];

    userRepositoryMock.findAll.mockResolvedValueOnce(users);

    const response = await useCase.execute();

    expect(userRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(response.users).toHaveLength(1);
    expect(response.users[0]).toEqual({
      id: users[0].id,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      email: users[0].email,
    });
  });
});
