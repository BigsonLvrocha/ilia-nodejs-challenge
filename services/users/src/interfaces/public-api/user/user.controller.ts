import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ListUsersUseCase } from '../../../use-cases/list-users-use-case.js';
import { AuthGuard } from '../auth/auth-guard.js';
import { type UserResponseDto } from './user.response.dto.js';
import { CreateUserUseCase } from '../../../use-cases/create-user-use-case.js';
import { UserRequestDto } from './user.request.dto.js';
import { ReadUserUseCase } from '../../../use-cases/read-user-use-case.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly readUserUseCase: ReadUserUseCase
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute();
    return users.users.map((user) => ({
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    }));
  }

  @Post()
  @HttpCode(200)
  async createUser(@Body() params: UserRequestDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute({
      email: params.email,
      firstName: params.first_name,
      lastName: params.last_name,
      password: params.password,
    });

    return {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      id: user.id,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.readUserUseCase.execute({ userId: id });
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }
}
