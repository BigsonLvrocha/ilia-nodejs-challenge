import { HttpService } from '@nestjs/axios';
import { type TransactionsServiceInterface } from '../domain/transactions-service-interface.js';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AxiosTransactionService implements TransactionsServiceInterface {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get('TRANSACTIONS_SERVICE_URL') ?? '';
  }

  async getBalance(userId: string): Promise<number> {
    const token = await this.jwtService.signAsync({ userId });
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    return data.balance;
  }
}
