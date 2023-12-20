import { Module } from '@nestjs/common';
import { AuthGuard } from './auth-guard.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('PRIVATE_API_JWT_SECRET') ??
          'private-api-jwt-secret',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
