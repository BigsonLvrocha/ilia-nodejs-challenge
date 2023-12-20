import { type User } from './user.js';

export interface UserRepositoryInterface {
  create: (user: User) => Promise<void>;
  findAll: () => Promise<User[]>;
}
