import { IsNotEmpty } from 'class-validator';

export class LoginModel {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}
