import { Controller, Delete, Get,Patch, Post, Put,Body,Param,NotFoundException,Query,ParseArrayPipe,HttpStatus } from '@nestjs/common';
import { TodoModule } from './todo.module';
import {v4 as uuidv4} from 'uuid';
import { TodoStatusEnum } from './todo.TodoStatusEnum';
import { TodoModel } from './todo.model';
import { query } from 'express';
import { todoDto } from './todo.todoDto';
import { todoUpdateDto } from './todo.todoUpdateDto';
import {TodoService} from "./todo.todoService";
import { skillsDto } from './todo.skills.Dto';
import { OurPipePipe } from 'src/pipes/our-pipe.pipe';
import { FindTodoDto } from './todo.findDto';
import { todoEntity } from './todo.todoEntity';
@Controller({
  path: 'todo',
  version: '1',
  })
export class TodoController {
    private todos = [];

    constructor(private toDoModuleService: TodoService) {}


    @Get('all')
    getTodos() {
        // Todo 2 : Get the todo liste
        console.log('getTodos')
        return(this.toDoModuleService.listTodosLocal());
    }

    @Get('byid/:id')
    findTodo(@Param('id') id:string) {
        console.log(id);
        return this.toDoModuleService.findTodoLocal(id);
    }

    @Delete('delete/:id')
    deleteTodo(@Param('id') id:string) {
        return(this.toDoModuleService.deleteTodoLocal(id));
    }

    @Post('add')
    addTodoDto(@Body() body:todoDto){
        return (this.toDoModuleService.addTodoLocal(body));
    }
    

    @Put('update/:id')
    updateTodoDto(@Param('id') id:string,@Body() body:todoUpdateDto) {
       return(this.toDoModuleService.updateTodoLocal(id,body));
    }

}   