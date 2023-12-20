import { ConflictException } from '@nestjs/common';

export class UserHasBalanceException extends ConflictException {
  constructor() {
    super('User cannot be deleted because it has balance');
  }
}
