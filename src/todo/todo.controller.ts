import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoListModel } from './model/todo.list.model';
import { TodoModel } from './model/todo.model';
import { CreateTodoModel } from './model/todo.create.model';
import { TodoService } from './todo.service';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from '@user/model/user.model';
import { ApiTags } from '@nestjs/swagger';

ApiTags("todos")
@Controller('api/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll(@Req() req: any): Promise<TodoListModel> {
    const todos = await this.todoService.getAllTodo();
    return { todos };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TodoModel> {
    return await this.todoService.getOneTodo(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(
    @Body() createTodoModel: CreateTodoModel,
    @Req() req: any,
  ): Promise<TodoModel> {
    const user = req.user as UserModel;

    return await this.todoService.createTodo(user, createTodoModel);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: number,
    @Body() todoModel: TodoModel,
  ): Promise<TodoModel> {
    return await this.todoService.updateTodo(id, todoModel);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async destory(@Param('id') id: number): Promise<TodoModel> {
    return await this.todoService.destoryTodo(id);
  }
}
