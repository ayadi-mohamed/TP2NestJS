import { Module } from '@nestjs/common';
import { uuidProvider } from 'src/common/common.uuidProvider';
import { TodoController } from './todo.controller';
import { todoEntity } from './todo.todoEntity';
import { TodoService } from './todo.todoService';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { TodoControllerDB } from './todo.dbcontroller';

@Module({
  imports: [TypeOrmModule.forFeature([todoEntity])],
  controllers: [TodoController, TodoControllerDB],
  providers:[uuidProvider, TodoService]
})
export class TodoModule {
}
