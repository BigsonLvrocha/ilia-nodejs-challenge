import { type User } from './user.js';

export interface UserRepositoryInterface {
  create: (user: User) => Promise<void>;
  findAll: () => Promise<User[]>;
  update: (user: User) => Promise<void>;
  findById: (id: string) => Promise<User | null>;
}
