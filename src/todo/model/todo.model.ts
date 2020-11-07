import { TaskModel } from './task.model';
import { IsNotEmpty } from 'class-validator';
import { UserModel } from '../../users/model/user.model';

export class TodoModel {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  createdOn?: Date;
  description?: string;

  owner: UserModel;

  tasks?: TaskModel[];
}
