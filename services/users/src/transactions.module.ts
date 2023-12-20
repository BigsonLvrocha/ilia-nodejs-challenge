import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { providersEnum } from './providers.enum.js';
import { AxiosTransactionService } from './infrastructure/axios-transactions-service.js';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('PRIVATE_API_JWT_SECRET'),
        signOptions: {
          expiresIn: '5m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: providersEnum.TransactionsService,
      useClass: AxiosTransactionService,
    },
  ],
  exports: [providersEnum.TransactionsService],
})
export class TransactionsModule {}
