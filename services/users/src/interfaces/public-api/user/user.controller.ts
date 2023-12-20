import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ListUsersUseCase } from '../../../use-cases/list-users-use-case.js';
import { AuthGuard } from '../auth/auth-guard.js';
import { type UserResponseDto } from './user.response.dto.js';
import { CreateUserUseCase } from '../../../use-cases/create-user-use-case.js';
import { UserRequestDto } from './user.request.dto.js';
import { ReadUserUseCase } from '../../../use-cases/read-user-use-case.js';
import { UpdateUserUseCase } from '../../../use-cases/update-user-use-case.js';
import { PatchUserRequestDto } from './patch-user.request.dto.js';
import { User } from '../auth/user.decorator.js';
import { ApiUser } from '../auth/api-user.js';
import { DeleteUserUseCase } from '../../../use-cases/delete-user-use-case.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly readUserUseCase: ReadUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() data: PatchUserRequestDto,
    @User() apiUser: ApiUser
  ): Promise<UserResponseDto> {
    if (id !== apiUser.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.updateUserUseCase.execute({
      userId: id,
      data: {
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        password: data.password,
      },
    });
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id') id: string,
    @User() apiUser: ApiUser
  ): Promise<void> {
    if (id !== apiUser.userId) {
      throw new UnauthorizedException();
    }
    await this.deleteUserUseCase.execute({ id });
  }
}
