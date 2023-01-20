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
        return(this.toDoModuleService.getTodo());
    }


    //without DTO
    @Post('nodto')
    addTodo(@Body() body){
        if (!body.name) throw new NotFoundException();
        if (!body.description) throw new NotFoundException();
        const todo = new TodoModel();
        todo.description = body.description;
        todo.name = body.name;
        console.log(todo);
        this.todos.push(todo);
        return todo;
    }
    
    @Get('byid')
    findTodo(@Query('id') id) {
        console.log(id);
        return this.toDoModuleService.findTodo(id);
    }

    @Delete('byid')
    deleteTodo(@Query('id') id) {
        return(this.toDoModuleService.deleteTodo(id));
    }

    @Put('byid')
    updateTodo(@Query('id') id,@Body() body) {
        console.log(id);
        if (!id) throw new NotFoundException();
        console.log(1)
        const todo = this.findTodo(id)
        //throw exception if not found
        if (!todo) throw new NotFoundException();
        console.log(2)
        if (!body.name) throw new NotFoundException();
        if (!body.description) throw new NotFoundException();
        if (!body.status) throw new NotFoundException();
        
        todo.description = body.description;
        todo.name = body.name;
        console.log(Object.values(body.status))
        if(! (body.status.match('actif') ||
        (body.status.match('waiting')) ||
        (body.status.match('done')) ))
           throw new NotFoundException("invalid status");
        
        todo.status = body.status;
        return todo;
    }

    //with DTO
    @Post('byiddto')
    addTodoDto(@Body() body:todoDto){
        return (this.toDoModuleService.postTodoWithDTO(body));
    }
    

    @Put('byiddto')
    updateTodoDto(@Query('id') id,@Body() body:todoUpdateDto) {
       return(this.toDoModuleService.updateTodoWithDTO(id,body));
    }
 
  /*  @Get('/id/:id')
    getTodoById(@Param('id') id:string) {
      return this.toDoModuleService.getTodoById(id);
*/

}   