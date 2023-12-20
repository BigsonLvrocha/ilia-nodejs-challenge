import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { describe, beforeEach, it, expect, afterEach } from '@jest/globals';
import { type MongooseUserRepository } from './mongoose-user-repository.js';
import { UserDefinition, type UserModel } from './model/user.schema.js';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UserModule } from '../user.module.js';
import { User } from '../domain/user.js';
import { providersEnum } from '../providers.enum.js';

describe('MongooseUserRepository', () => {
  let mongoServer: MongoMemoryServer;
  let userModel: UserModel;
  let userRepository: MongooseUserRepository;
  let testModule: TestingModule;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    testModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoServer.getUri()), UserModule],
    }).compile();

    userModel = testModule.get(getModelToken(UserDefinition.name));
    userRepository = testModule.get(providersEnum.UserRepository);
  });

  afterEach(async () => {
    await testModule.close();
    await mongoServer.stop();
  });

  describe('create', () => {
    it('creates a user', async () => {
      const user = await User.createNewUser({
        email: 'john@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      });

      await userRepository.create(user);

      const usersInDb = await userModel.find().exec();
      expect(usersInDb).toHaveLength(1);
      expect(usersInDb[0].email).toEqual('john@gmail.com');
      expect(usersInDb[0].firstName).toEqual('John');
      expect(usersInDb[0].lastName).toEqual('Doe');
      expect(usersInDb[0].passwordHash).not.toEqual('password');
    });
  });
});
