import { Module } from '@nestjs/common';
import { providersEnum } from './providers.enum.js';
import { MongooseUserRepository } from './infrastructure/mongoose-user-repository.js';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDefinition,
  UserSchema,
} from './infrastructure/model/user.schema.js';
import { CreateUserUseCase } from './use-cases/create-user-use-case.js';
import { AuthUserUseCase } from './use-cases/auth-user-use-case.js';
import { DeleteUserUseCase } from './use-cases/delete-user-use-case.js';
import { ListUsersUseCase } from './use-cases/list-users-use-case.js';
import { ReadUserUseCase } from './use-cases/read-user-use-case.js';
import { UpdateUserUseCase } from './use-cases/update-user-use-case.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDefinition.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: providersEnum.UserRepository,
      useClass: MongooseUserRepository,
    },
    CreateUserUseCase,
    AuthUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    ReadUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [
    CreateUserUseCase,
    AuthUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    ReadUserUseCase,
    UpdateUserUseCase,
  ],
})
export class UserModule {}
