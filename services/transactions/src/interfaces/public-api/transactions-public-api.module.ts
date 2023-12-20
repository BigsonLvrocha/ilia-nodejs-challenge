import { Module } from '@nestjs/common';
import { TransactionsModule } from '../../transactions.module.js';
import { TransactionsController } from './transactions/transactions-controller.js';
import { BalanceController } from './balance/balance-controller.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [AuthModule, TransactionsModule],
  controllers: [TransactionsController, BalanceController],
})
export class TransactionsPublicApiModule {}
