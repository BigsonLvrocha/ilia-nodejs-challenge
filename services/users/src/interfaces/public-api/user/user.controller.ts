import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListUsersUseCase } from '../../../use-cases/list-users-use-case.js';
import { AuthGuard } from '../auth/auth-guard.js';
import { type UserResponseDto } from './user.response.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly listUsers: ListUsersUseCase) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.listUsers.execute();
    return users.users.map((user) => ({
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    }));
  }
}
