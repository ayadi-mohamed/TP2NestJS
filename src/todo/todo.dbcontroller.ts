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


    @Get('all')
    getTodosDB() {
        // Todo 2 : Get the todo liste
        console.log('getTodosDB')
        return(this.toDoModuleService.listTodosDb());
    }

    @Get('byid/:id')
    findTodo(@Param('id') id:string) {
        console.log(id);
        return this.toDoModuleService.findTodoDb(id);
    }

    @Post('add')
    addTodoDb(@Body() body:todoDto){
        return (this.toDoModuleService.addTodoDb(body));
    }
    @Put('update/:id')
    updateTodoDb(@Param('id') id:string,@Body() body:todoUpdateDto) {
       return(this.toDoModuleService.updateTodoDb(id,body));
       
    }
    @Delete('delete/:id')
    deleteDb(@Param('id') id:string) {
        return(this.toDoModuleService.deleteTodoDb(id));
    }
    @Get('restore/:id')
    restoreTodo(@Param('id') id:string) {
      return this.toDoModuleService.restoreTodoDb(id);
    } 

    @Get('count/:status')
    countByStatus(@Param('status') status:TodoStatusEnum): any {
      return this.toDoModuleService.countByStatusDb(status);
    }

    @Get('allpag')
    getTodoss(): Promise<todoEntity[]> {
      return this.toDoModuleService.getTodosWithPaginationDb();
    }

    @Get('search')
    findByCriterias(@Query() findTodoDto: FindTodoDto) {
      return this.toDoModuleService.findByCriteriasDb(findTodoDto);
    }

  
}   