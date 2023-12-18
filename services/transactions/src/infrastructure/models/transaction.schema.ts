import { type Decimal128, type HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transaction {
  @Prop({
    required: true,
  })
  id!: string;

  @Prop({
    required: true,
  })
  userId!: string;

  @Prop({
    required: true,
  })
  balanceChange!: Decimal128;

  @Prop({
    required: true,
    default: Date.now,
  })
  timestamp!: Date;
}

export type TransactionDocument = HydratedDocument<Transaction>;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
