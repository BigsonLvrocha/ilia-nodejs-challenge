import { type HydratedDocument, type Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TransactionDefinition {
  @Prop({
    required: true,
  })
  id!: string;

  @Prop({
    required: true,
    index: true,
  })
  userId!: string;

  @Prop({
    required: true,
  })
  balanceChange!: number;

  @Prop({
    required: true,
    index: true,
    default: Date.now,
  })
  timestamp!: Date;
}

export type TransactionDocument = HydratedDocument<TransactionDefinition>;

export type TransactionModel = Model<TransactionDefinition>;

export const TransactionSchema = SchemaFactory.createForClass(
  TransactionDefinition
);
