import { ConflictException } from '@nestjs/common';

export class UserEmailTakenException extends ConflictException {
  constructor() {
    super('User email taken');
  }
}
