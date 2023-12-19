import { Module } from '@nestjs/common';
import { TransactionsModule } from '../../transactions.module.js';
import { TransactionsController } from './transactions-controller.js';

@Module({
  imports: [TransactionsModule],
  controllers: [TransactionsController],
})
export class TransactionsPublicApiModule {}
