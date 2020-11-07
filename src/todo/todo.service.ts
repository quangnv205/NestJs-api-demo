import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from '../todo/entity/todo.entity';
import { TodoModel } from './model/todo.model';
import { toTodoModel } from '../shared/mapper';
import { CreateTodoModel } from './model/todo.create.model';
import { Repository } from 'typeorm';
import { UserModel } from '../users/model/user.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getAllTodo(): Promise<TodoModel[]> {
    const todos = await this.todoRepo.find({ relations: ['tasks', 'owner'] });
    return todos.map(todo => toTodoModel(todo));
  }

  async getOneTodo(id: string): Promise<TodoModel> {
    const todo = await this.todoRepo.findOne({
      where: { id },
      relations: ['tasks', 'owner'],
    });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return toTodoModel(todo);
  }

  async createTodo(
    { username }: UserModel,
    createTodoModel: CreateTodoModel,
  ): Promise<TodoModel> {
    const { name, description } = createTodoModel;

    // get the user from db
    const owner = await this.usersService.findOne({ where: { username } });

    const todo: TodoEntity = await this.todoRepo.create({
      name,
      description,
      owner,
    });

    await this.todoRepo.save(todo);

    return toTodoModel(todo);
  }

  async updateTodo(id: number, todoDto: TodoModel): Promise<TodoModel> {
    const { name, description } = todoDto;

    let todo: TodoEntity = await this.todoRepo.findOne({ where: { id } });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    todo = {
      id,
      name,
      description,
    };

    await this.todoRepo.update({ id }, todo); // update

    todo = await this.todoRepo.findOne({
      where: { id },
      relations: ['tasks', 'owner'],
    }); // re-query

    return toTodoModel(todo);
  }

  async destoryTodo(id: number): Promise<TodoModel> {
    const todo: TodoEntity = await this.todoRepo.findOne({
      where: { id },
      relations: ['tasks', 'owner'],
    });

    if (!todo) {
      throw new HttpException(
        `Todo list doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (todo.tasks && todo.tasks.length > 0) {
      throw new HttpException(
        `Cannot delete this Todo list, it has existing tasks`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.todoRepo.delete({ id }); // delete todo list

    return toTodoModel(todo);
  }
}
