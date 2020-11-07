import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserModel {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  createdOn?: Date;
}
