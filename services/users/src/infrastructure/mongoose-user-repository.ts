import { Injectable } from '@nestjs/common';
import { type UserRepositoryInterface } from '../domain/user-repository-interface.js';
import { User } from '../domain/user.js';
import { InjectModel } from '@nestjs/mongoose';
import { UserDefinition, UserModel } from './model/user.schema.js';

@Injectable()
export class MongooseUserRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(UserDefinition.name) private readonly userModel: UserModel
  ) {}

  async create(user: User): Promise<void> {
    await this.userModel.create({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      passwordHash: user.passwordHash,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => {
      return new User({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
      });
    });
  }
}
