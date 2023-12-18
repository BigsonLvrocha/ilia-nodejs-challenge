import { InjectModel } from '@nestjs/mongoose';

import { type TransactionServiceInterface } from '../domain/transaction-service-interface.js';
import { type Transaction } from '../domain/transactions.js';
import {
  TransactionDefinition,
  TransactionModel,
} from './models/transaction.schema.js';

export class MongooseTransactionService implements TransactionServiceInterface {
  constructor(
    @InjectModel(TransactionDefinition.name)
    private readonly transactionModel: TransactionModel
  ) {}

  async create(transaction: Transaction): Promise<void> {
    await this.transactionModel.create({
      id: transaction.id,
      balanceChange: transaction.balanceChange,
      timestamp: transaction.timestamp,
      userId: transaction.userId,
    });
  }
}
