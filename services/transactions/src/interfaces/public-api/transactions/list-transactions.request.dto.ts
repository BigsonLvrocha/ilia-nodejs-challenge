import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../../../domain/transaction-type.enum.js';
import { IsEnum, IsOptional } from 'class-validator';

export class ListTransactionsRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(TransactionType)
  readonly type?: TransactionType;
}
