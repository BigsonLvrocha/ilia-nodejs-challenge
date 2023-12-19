import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './auth-guard.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('PUBLIC_API_JWT_SECRET'),
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
