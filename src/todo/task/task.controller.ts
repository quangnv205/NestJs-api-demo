import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskListModel } from '../model/task.list.model';
import { TaskModel } from '../model/task.model';
import { CreateTaskModel } from '../model/task.create.model';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('task')
@Controller('api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(':id')
  async findOneTask(@Param('id') id: string): Promise<TaskModel> {
    return await this.taskService.getTask(id);
  }

  @Get('todo/:id')
  async findTasksByTodo(@Param('id') id: number): Promise<TaskListModel> {
    const tasks = await this.taskService.getTasksByTodo(id);
    return { tasks };
  }

  @Post('todo/:id')
  @UseGuards(AuthGuard())
  async create(
    @Param('id') todo: number,
    @Body() createTaskModel: CreateTaskModel,
  ): Promise<TaskModel> {
    return await this.taskService.createTask(todo, createTaskModel);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destory(@Param('id') id: number): Promise<TaskModel> {
    return await this.taskService.destoryTask(id);
  }
}
