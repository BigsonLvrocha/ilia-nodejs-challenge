import { Module } from '@nestjs/common';
import { TransactionsModule } from '../../transactions.module.js';
import { TransactionsController } from './transactions-controller.js';
import { BalanceController } from './balance-controller.js';

@Module({
  imports: [TransactionsModule],
  controllers: [TransactionsController, BalanceController],
})
export class TransactionsPublicApiModule {}
