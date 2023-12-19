import { type TransactionType } from './transaction-type.enum.js';
import { type Transaction } from './transactions.js';

export interface TransactionFindOptions {
  userId: string;
  type?: TransactionType;
}

export interface TransactionServiceInterface {
  create: (transaction: Transaction) => Promise<void>;
  find: (options: TransactionFindOptions) => Promise<Transaction[]>;
  getBalance: (userId: string) => Promise<number>;
}
