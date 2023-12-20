import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../use-cases/create-transaction-use-case.js';
import { AuthGuard } from '../auth/auth-guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TransactionRequestDto } from './transaction.request.dto.js';
import { type TransactionResponseDto } from './transaction.response.dto.js';
import { User } from '../auth/user.decorator.js';
import { ApiUser } from '../auth/api-user.js';
import { ListTransactionsUseCase } from '../../../use-cases/list-transactions-use-case.js';
import { ListTransactionsRequestDto } from './list-transactions.request.dto.js';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post()
  async createTransaction(
    @Body() transaction: TransactionRequestDto,
    @User() user: ApiUser
  ): Promise<TransactionResponseDto> {
    if (user.userId !== transaction.user_id) {
      throw new UnauthorizedException('Invalid user');
    }
    const result = await this.createTransactionUseCase.execute({
      userId: transaction.user_id,
      amount: transaction.amount,
      type: transaction.type,
    });
    return {
      amount: result.amount,
      user_id: result.userId,
      id: result.id,
      type: result.type,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async listTransactions(
    @Query() query: ListTransactionsRequestDto,
    @User() user: ApiUser
  ): Promise<TransactionResponseDto[]> {
    const results = await this.listTransactionsUseCase.execute({
      userId: user.userId,
      type: query.type,
    });
    return results.transactions.map((transaction) => ({
      amount: transaction.amount,
      user_id: transaction.userId,
      id: transaction.id,
      type: transaction.type,
    }));
  }
}
