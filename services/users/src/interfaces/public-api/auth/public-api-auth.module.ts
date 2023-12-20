import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../../user.module.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('PUBLIC_API_JWT_SECRET') ?? 'default-secret',
        signOptions: {
          expiresIn: config.get('PUBLIC_API_JWT_EXPIRATION_TIME') ?? '7d',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
})
export class PublicApiAuthModule {}
