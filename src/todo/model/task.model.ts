import { IsNotEmpty, IsString } from 'class-validator';

export class TaskModel {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  createdOn?: Date;
}
