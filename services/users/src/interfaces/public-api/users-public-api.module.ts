import { Module } from '@nestjs/common';
import { PublicApiAuthModule } from './auth/public-api-auth.module.js';
import { UserModule } from '../../user.module.js';
import { UserController } from './user/user.controller.js';

@Module({
  imports: [PublicApiAuthModule, UserModule],
  controllers: [UserController],
})
export class UsersPublicApiModule {}
