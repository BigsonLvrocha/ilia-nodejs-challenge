import { describe, it, beforeEach, expect, jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { Test, type TestingModule } from '@nestjs/testing';
import { AxiosHeaders, type AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { type AxiosTransactionService } from './axios-transactions-service.js';
import { TransactionsModule } from '../transactions.module.js';
import { v4 as uuid } from 'uuid';
import { ConfigModule } from '@nestjs/config';
import { providersEnum } from '../providers.enum.js';
import { JwtService } from '@nestjs/jwt';

describe('AxiosTransactionsService', () => {
  const httpServiceMockFactory = (): {
    get: jest.Mock<(url: string, config?: any) => Observable<AxiosResponse>>;
  } => ({
    get: jest.fn(
      () =>
        new Observable((subscribe) => {
          subscribe.next({
            data: { balance: 100 },
            status: 200,
            statusText: 'success',
            headers: {},
            config: { headers: new AxiosHeaders() },
          });
          subscribe.complete();
        })
    ),
  });

  let testModule: TestingModule;
  let httpServiceMock: ReturnType<typeof httpServiceMockFactory>;
  let service: AxiosTransactionService;
  let jwtService: JwtService;
  const userId = uuid();

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              PRIVATE_API_JWT_SECRET: 'test-private-api-jwt-secret',
            }),
          ],
        }),
        TransactionsModule,
      ],
    })
      .overrideProvider(HttpService)
      .useFactory({
        factory: httpServiceMockFactory,
      })
      .compile();

    httpServiceMock = testModule.get(HttpService);
    service = testModule.get(providersEnum.TransactionsService);
    jwtService = testModule.get(JwtService);
  });

  it('queries the balance via axios request', async () => {
    const response = await service.getBalance(userId);
    expect(response).toBe(100);

    expect(httpServiceMock.get).toHaveBeenCalledWith('/balance', {
      headers: {
        Authorization: expect.any(String),
      },
    });

    const headers = httpServiceMock.get.mock.calls[0][1].headers;
    const token = (headers.Authorization as string).replace('Bearer ', '');
    const payload = await jwtService.verifyAsync(token);
    expect(payload.userId).toBe(userId);
  });
});
