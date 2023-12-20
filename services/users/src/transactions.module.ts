import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { providersEnum } from './providers.enum.js';
import { AxiosTransactionService } from './infrastructure/axios-transactions-service.js';

@Module({
  imports: [HttpModule, JwtModule],
  providers: [
    {
      provide: providersEnum.TransactionsService,
      useClass: AxiosTransactionService,
    },
  ],
  exports: [providersEnum.TransactionsService],
})
export class TransactionsModule {}
