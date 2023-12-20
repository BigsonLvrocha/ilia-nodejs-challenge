import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthUserUseCase } from '../../../use-cases/auth-user-use-case.js';
import { AuthRequestDto } from './auth.request.dto.js';
import { JwtService } from '@nestjs/jwt';
import { type AuthResponseDto } from './auth.response.dto.js';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUserUseCase: AuthUserUseCase,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @HttpCode(200)
  async login(@Body() body: AuthRequestDto): Promise<AuthResponseDto> {
    const { userId } = await this.authUserUseCase.execute({
      email: body.email,
      password: body.password,
    });
    const token = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get('PUBLIC_API_JWT_SECRET'),
        expiresIn: '7d',
      }
    );
    return { token };
  }
}
