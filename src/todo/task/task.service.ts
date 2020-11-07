import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskModel } from '../model/task.create.model';
import { TaskModel } from '../model/task.model';
import { TaskEntity } from '../../todo/entity/task.entity';
import { toTaskModel } from '../../shared/mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../../todo/entity/todo.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}

  async getTask(id: string): Promise<TaskModel> {
    const task: TaskEntity = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return toTaskModel(task);
  }

  async getTasksByTodo(id: number): Promise<TaskModel[]> {
    const tasks: TaskEntity[] = await this.taskRepo.find({
      where: { todo: { id } },
      relations: ['todo'],
    });

    return tasks.map(task => toTaskModel(task));
  }

  async createTask(todoId: number, taskModel: CreateTaskModel): Promise<TaskModel> {
    const { name } = taskModel;

    const todo: TodoEntity = await this.todoRepo.findOne({
      where: { id: todoId },
      relations: ['tasks', 'owner'],
    });

    const task: TaskEntity = await this.taskRepo.create({
      name,
      todo,
    });

    await this.taskRepo.save(task);

    return toTaskModel(task);
  }

  async destoryTask(id: number): Promise<TaskModel> {
    const task: TaskEntity = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new HttpException(`Task doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    await this.taskRepo.delete({ id });

    return toTaskModel(task);
  }
}
