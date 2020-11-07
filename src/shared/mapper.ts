import { TaskModel } from '../todo/model/task.model';
import { TodoModel } from '../todo/model/todo.model';
import { TaskEntity } from '../todo/entity/task.entity';
import { UserEntity } from '../users/entity/user.entity';
import { UserModel } from '../users/model/user.model';
import { TodoEntity } from '../todo/entity/todo.entity';

export const toTodoModel = (data: TodoEntity): TodoModel => {
  const { id, name, description, tasks, owner } = data;

  let todoModel: TodoModel = {
    id,
    name,
    description,
    owner: owner ? toUserModel(owner) : null,
  };

  if (tasks) {
    todoModel = {
      ...todoModel,
      tasks: tasks.map((task: TaskEntity) => toTaskModel(task)),
    };
  }

  return todoModel;
};

export const toTaskModel = (data: TaskEntity): TaskModel => {
  const { id, name } = data;

  let taskModel: TaskModel = {
    id,
    name,
  };

  return taskModel;
};

export const toUserModel = (data: UserEntity): UserModel => {
  const { id, username, email } = data;

  let user: UserModel = {
    id,
    username,
    email,
  };

  return user;
};
