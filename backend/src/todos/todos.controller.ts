import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import mongoose from 'mongoose';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    console.log(createTodoDto);
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new HttpException('Not Found', 404);

    const getTodo = await this.todosService.findOne(id);

    if (!getTodo) throw new HttpException('Not Found', 404);

    return getTodo;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
