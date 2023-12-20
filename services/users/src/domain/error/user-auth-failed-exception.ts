import { UnauthorizedException } from '@nestjs/common';

export class UserAuthFailedException extends UnauthorizedException {
  constructor() {
    super('User auth failed');
  }
}
