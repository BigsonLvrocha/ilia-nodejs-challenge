import { Module } from '@nestjs/common';
import { BalanceController } from './balance/balance-controller.js';
import { TransactionsModule } from '../../transactions.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [AuthModule, TransactionsModule],
  controllers: [BalanceController],
})
export class TransactionsPrivateApiModule {}
