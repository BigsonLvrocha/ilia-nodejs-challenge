import { IsEmail, IsStrongPassword } from 'class-validator';

export class UserRequestDto {
  first_name!: string;

  last_name!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;
}
