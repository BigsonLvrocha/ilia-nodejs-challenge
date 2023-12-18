import { TransactionType } from './transaction-type.enum.js';

interface TransactionArguments {
  type: TransactionType;
  amount: number;
  userId: string;
}

export class Transaction {
  public readonly type: TransactionType;
  public readonly amount: number;
  public readonly userId: string;
  public readonly balanceChange: number;

  constructor({ type, amount, userId }: TransactionArguments) {
    this.type = type;
    this.amount = amount;
    this.userId = userId;
    this.balanceChange = type === TransactionType.CREDIT ? amount : -amount;
  }
}