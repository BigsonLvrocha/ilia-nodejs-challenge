import { v4 as uuid } from 'uuid';
import { InvalidAmountError } from './errors/invalid-amount-error.js';
import { TransactionType } from './transaction-type.enum.js';

interface TransactionArguments {
  id?: string;
  type: TransactionType;
  amount: number;
  userId: string;
  timestamp?: Date;
}

export class Transaction {
  public readonly id: string;
  public readonly type: TransactionType;
  public readonly amount: number;
  public readonly userId: string;
  public readonly balanceChange: number;
  public readonly timestamp: Date;

  constructor({
    id = uuid(),
    type,
    amount,
    userId,
    timestamp = new Date(),
  }: TransactionArguments) {
    this.validateAmount(amount);

    this.id = id;
    this.type = type;
    this.amount = amount;
    this.userId = userId;
    this.balanceChange = type === TransactionType.CREDIT ? amount : -amount;
    this.timestamp = timestamp;
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new InvalidAmountError();
    }
    if (!Number.isInteger(amount)) {
      throw new InvalidAmountError();
    }
  }
}
