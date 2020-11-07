import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateTodoModel {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @MaxLength(500)
  description?: string;
}
