import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
})
export class TodosModule {}
