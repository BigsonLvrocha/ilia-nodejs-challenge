import { type HydratedDocument, type Model } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserDefinition {
  @Prop({
    required: true,
  })
  id!: string;

  @Prop({
    required: true,
  })
  firstName!: string;

  @Prop({
    required: true,
  })
  lastName!: string;

  @Prop({
    required: true,
  })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({
    required: true,
    default: Date.now,
  })
  createdAt!: Date;
}

export type UserDocument = HydratedDocument<UserDefinition>;

export type UserModel = Model<UserDefinition>;

export const UserSchema = SchemaFactory.createForClass(UserDefinition);
