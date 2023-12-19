import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../use-cases/create-transaction-use-case.js';
import { AuthGuard } from './auth/auth-guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto.js';
import { type TransactionModelDto } from './transaction-model.dto.js';
import { User } from './auth/user.decorator.js';
import { AuthUser } from './auth/auth-types.js';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post()
  async createTransaction(
    @Body() transaction: TransactionDto,
    @User() user: AuthUser
  ): Promise<TransactionModelDto> {
    if (user.userId !== transaction.userId) {
      throw new UnauthorizedException('Invalid user');
    }
    const result = await this.createTransactionUseCase.execute(transaction);
    return {
      amount: result.amount,
      user_id: result.userId,
      id: result.id,
      type: result.type,
    };
  }
}
