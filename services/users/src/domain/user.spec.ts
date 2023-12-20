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

  it('changes the first name', async () => {
    const user = new User({
      email: 'john.cage@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: '123',
      id: '123',
    });

    user.changeFirstName('Johnny');

    expect(user.firstName).toEqual('Johnny');
  });

  it('changes the last name', async () => {
    const user = new User({
      email: 'john.cage@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: '123',
      id: '123',
    });

    user.changeLastName('Does');

    expect(user.lastName).toEqual('Does');
  });

  it('changes the email', async () => {
    const user = new User({
      email: 'john.cage@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: '123',
      id: '123',
    });

    user.changeEmail('john.travolta@gmail.com');

    expect(user.email).toEqual('john.travolta@gmail.com');
  });

  it('changes the password', async () => {
    const user = new User({
      email: 'john.cage@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: '123',
      id: '123',
    });

    await user.changePassword('1234');

    expect(await bcrypt.compare('1234', user.passwordHash)).toBe(true);
  });
});
