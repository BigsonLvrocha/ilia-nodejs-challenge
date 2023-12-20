import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthUserUseCase } from '../../../use-cases/auth-user-use-case.js';
import { AuthRequestDto } from './auth.request.dto.js';
import { JwtService } from '@nestjs/jwt';
import { type AuthResponseDto } from './auth.response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUserUseCase: AuthUserUseCase,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @HttpCode(200)
  async login(@Body() body: AuthRequestDto): Promise<AuthResponseDto> {
    const { userId } = await this.authUserUseCase.execute({
      email: body.email,
      password: body.password,
    });
    const token = await this.jwtService.signAsync({ userId });
    return { token };
  }
}
