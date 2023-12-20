import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../../user.module.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth-guard.js';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class PublicApiAuthModule {}
