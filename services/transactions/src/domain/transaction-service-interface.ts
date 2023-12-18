import { type Transaction } from './transactions.js';

export interface TransactionServiceInterface {
  create: (transaction: Transaction) => Promise<void>;
}
