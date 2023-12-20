import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

interface UserInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

interface NewUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class User {
  public readonly id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _passwordHash: string;

  constructor(props: UserInput) {
    this.id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  public changeFirstName(newFirstName: string): void {
    this._firstName = newFirstName;
  }

  public changeLastName(newLastName: string): void {
    this._lastName = newLastName;
  }

  public changeEmail(newEmail: string): void {
    this._email = newEmail;
  }

  public async changePassword(newPassword: string): Promise<void> {
    this._passwordHash = await bcrypt.hash(newPassword, 10);
  }

  public async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this._passwordHash);
  }

  public static async createNewUser(props: NewUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(props.password, 10);

    const user = new User({
      id: uuid(),
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      passwordHash,
    });

    return user;
  }
}
