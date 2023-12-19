import { InjectModel } from '@nestjs/mongoose';

import {
  type TransactionFindOptions,
  type TransactionServiceInterface,
} from '../domain/transaction-service-interface.js';
import { Transaction } from '../domain/transactions.js';
import {
  TransactionDefinition,
  TransactionModel,
} from './models/transaction.schema.js';
import { TransactionType } from '../domain/transaction-type.enum.js';

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

  async find(options: TransactionFindOptions): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find({
      userId: options.userId,
      ...(options.type !== null && options.type !== undefined
        ? {
            balanceChange:
              options.type === TransactionType.CREDIT
                ? { $gte: 0 }
                : { $lt: 0 },
          }
        : {}),
    });

    return transactions.map(
      (transaction) =>
        new Transaction({
          id: transaction.id,
          amount: Math.abs(transaction.balanceChange),
          timestamp: transaction.timestamp,
          userId: transaction.userId,
          type:
            transaction.balanceChange > 0
              ? TransactionType.CREDIT
              : TransactionType.DEBIT,
        })
    );
  }

  async getBalance(userId: string): Promise<number> {
    const result = await this.transactionModel.aggregate([
      {
        $match: { userId },
      },
      {
        $group: {
          _id: '$userId',
          total: {
            $sum: '$balanceChange',
          },
        },
      },
    ]);

    return result[0].total;
  }
}
