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
    version: '2',
    })
export class TodoControllerDB {

    constructor(private toDoModuleService: TodoService) {}


    @Get('allDB')
    getTodosDB() {
        // Todo 2 : Get the todo liste
        console.log('getTodosDB')
        return(this.toDoModuleService.getTodoDB());
    }


    
    //with db

    @Post('adddb')
    addTodoDb(@Body() body:todoDto){
        return (this.toDoModuleService.postTodoWithDb(body));
    }
    @Put('updatedb')
    updateTodoDb(@Query('id') id,@Body() body:todoUpdateDto) {
       return(this.toDoModuleService.updateTodoWithDb(id,body));
       
    }
    @Delete('byid')
    deleteDb(@Query('id') id) {
        return(this.toDoModuleService.deleteTodoWithDb(id));
    }
    @Get('/restore/:id')
    restoreTodo(@Param('id') id:string) {
      return this.toDoModuleService.restoreTodo(id);
    } 

    @Get('/count')
    countByStatus(): any {
      return this.toDoModuleService.countByStatus();
    }

    @Get('/allPag')
    getTodoss(): Promise<todoEntity[]> {
      return this.toDoModuleService.getTodos();
    }

    @Get('/criterias')
    findByCriterias(@Query() findTodoDto: FindTodoDto) {
      return this.toDoModuleService.findByCriterias(findTodoDto);
    }

  
}   