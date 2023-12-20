import bcrypt from 'bcrypt';
import { describe, it, expect } from '@jest/globals';
import { User } from './user.js';

describe('User', () => {
  it('creates an user, assigns an id and returns it', async () => {
    const user = await User.createNewUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.cage@gmail.com',
      password: '123',
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.firstName).toEqual('John');
    expect(user.lastName).toEqual('Doe');
    expect(user.email).toEqual('john.cage@gmail.com');
    expect(user.passwordHash).not.toEqual('123');
    expect(await bcrypt.compare('123', user.passwordHash)).toBe(true);
  });
});
