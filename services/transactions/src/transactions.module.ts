import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionDefinition,
  TransactionSchema,
} from './infrastructure/models/transaction.schema.js';
import { TransactionProviderEnum } from './transactions-providers.enum.js';
import { MongooseTransactionService } from './infrastructure/mongoose-transaction-service.js';
import { CreateTransactionUseCase } from './use-cases/create-transaction-use-case.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionDefinition.name, schema: TransactionSchema },
    ]),
  ],
  providers: [
    {
      provide: TransactionProviderEnum.TransactionService,
      useClass: MongooseTransactionService,
    },
    CreateTransactionUseCase,
  ],
  exports: [CreateTransactionUseCase],
})
export class TransactionsModule {}
