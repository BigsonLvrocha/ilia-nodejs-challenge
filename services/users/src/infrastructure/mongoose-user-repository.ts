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

  async update(user: User): Promise<void> {
    await this.userModel.updateOne(
      { id: user.id },
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
      }
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ id }).exec();

    return user !== null
      ? new User({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          passwordHash: user.passwordHash,
        })
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user !== null
      ? new User({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          passwordHash: user.passwordHash,
        })
      : null;
  }

  async delete(user: User): Promise<void> {
    await this.userModel.updateOne({ id: user.id }, { deletedAt: new Date() });
  }
}
