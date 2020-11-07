import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserModel {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
