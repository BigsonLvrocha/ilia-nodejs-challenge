import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../domain/transaction-type.enum.js';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

export class TransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly amount!: number;

  @ApiProperty()
  @IsEnum(TransactionType)
  readonly type!: TransactionType;
}
