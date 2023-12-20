import { Module } from '@nestjs/common';
import { providersEnum } from './providers.enum.js';
import { MongooseUserRepository } from './infrastructure/mongoose-user-repository.js';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserDefinition,
  UserSchema,
} from './infrastructure/model/user.schema.js';
import { CreateUserUseCase } from './use-cases/create-user-use-case.js';

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
  ],
  exports: [CreateUserUseCase],
})
export class UserModule {}
