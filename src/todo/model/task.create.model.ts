import { IsNotEmpty } from 'class-validator';

export class CreateTaskModel {
  @IsNotEmpty()
  name: string;
}
