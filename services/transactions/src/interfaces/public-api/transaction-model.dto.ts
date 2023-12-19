import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../domain/transaction-type.enum.js';
import { Optional } from '@nestjs/common';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransactionModelDto {
  @ApiProperty()
  @Optional()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id!: string;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(0)
  amount!: number;

  @ApiProperty()
  @IsEnum(TransactionType)
  type!: TransactionType;
}
