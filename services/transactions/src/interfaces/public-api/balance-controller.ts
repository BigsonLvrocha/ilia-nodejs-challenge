import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './auth/user.decorator.js';
import { AuthUser } from './auth/auth-types.js';
import { GetBalanceUseCase } from '../../use-cases/get-balance-use-case.js';
import { AuthGuard } from './auth/auth-guard.js';

@Controller('balance')
export class BalanceController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getBalance(@User() user: AuthUser): Promise<{ amount: number }> {
    const result = await this.getBalanceUseCase.execute({
      userId: user.userId,
    });
    return { amount: result.amount };
  }
}
