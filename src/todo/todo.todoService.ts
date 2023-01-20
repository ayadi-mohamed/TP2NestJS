import { Controller, Delete, Get,Patch, Post, Put,Body,Param,NotFoundException,Query, Injectable} from '@nestjs/common';
import { TodoModule } from './todo.module';
import {v4 as uuidv4} from 'uuid';
import { TodoStatusEnum } from './todo.TodoStatusEnum';
import { TodoModel } from './todo.model';
import { query } from 'express';
import { todoDto } from './todo.todoDto';
import { todoUpdateDto } from './todo.todoUpdateDto';
import { uuidProvider } from 'src/common/common.uuidProvider';
import { todoEntity } from './todo.todoEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindTodoDto } from './todo.findDto';

@Injectable()
export class TodoService {
 
    private todos: TodoModel[] = []
 //private uuidProv: uuidProvider,
    constructor( @InjectRepository(todoEntity)
    private  postRepository: Repository<todoEntity>) {

    }

    findTodo(id: string): TodoModel {
        console.log(id);
        if (!id) throw new NotFoundException();
        const todo = this.todos.find((todo) => todo.id == id);
        //throw exception if not found
        if (!todo) throw new NotFoundException();
        return todo;
    }

    getTodo(): TodoModel[] {
        // Todo 2 : Get the todo liste
        console.log('getTodos')
        return(this.todos);
    }
    async getTodoDB(): Promise<todoEntity[]> {
        // Todo 2 : Get the todo liste
        console.log('getTodosDB')
        return await this.postRepository.find();
        }


    postTodoWithDTO(body: todoDto): TodoModel {
        if (!body.name) throw new NotFoundException();
        if (!body.description) throw new NotFoundException();
        const todo = new TodoModel();
        todo.description = body.description;
        todo.name = body.name;
        console.log(todo);
        this.todos.push(todo);

        return todo;
    }
    
    async postTodoWithDb(body: todoDto): Promise<todoEntity> {
        if (!body.name) throw new NotFoundException();
        if (!body.description) throw new NotFoundException();
        const todo = new TodoModel();
        todo.description = body.description;
        todo.name = body.name;
        console.log(todo);
        this.todos.push(todo);
        return await this.postRepository.save(todo);
    }


    deleteTodo(id: string): TodoModel {
        console.log(id);
        if (!id) throw new NotFoundException();
        const todo = this.todos.find((todo) => todo.id == id);
        //throw exception if not found
        if (!todo) throw new NotFoundException();
        const indexOfTodo = this.todos.indexOf(todo);
        this.todos.splice(indexOfTodo,1);
        return todo;
    }

    async deleteTodoWithDb(id: string): Promise<UpdateResult> {
        console.log(id);
        if (!id) throw new NotFoundException();
        const todo = this.todos.find((todo) => todo.id == id);
        //throw exception if not found
        if (!todo) throw new NotFoundException();
        const indexOfTodo = this.todos.indexOf(todo);
        this.todos.splice(indexOfTodo,1);
        const result = await this.postRepository.softDelete(id);
        if (result.affected) {
            return result;
        }
        throw new NotFoundException('Todo not found already!');


    }

    async restoreTodo(id:string) {
        const result = await this.postRepository.restore(id);
        if (result.affected) {
            return result;
        }
        throw new NotFoundException('Todo not found!');
    }

    async countByStatus(){
        const qb=this.postRepository.createQueryBuilder('todo');
        qb.select('todo.status, COUNT(todo.status) as count');
        qb.groupBy('todo.status');
        return qb.getRawMany();
    }

    async getTodos(): Promise<todoEntity[]> {
        return await this.postRepository.find();
    }
    pagination(data: [any, any],page: number,limit: number) {
        const [result,total]=data;
        const lastPage = Math.ceil(total/limit);
        const nextPage = page+1>lastPage?null:page+1;
        const previousPage = page-1<1?null:page-1;
        return {
          statusCode: 'success',
          data: [...result],
          count: total,
          currentPage: page,
          nextPage: nextPage,
          previousPage: previousPage,
          lastPage: lastPage,
        }
    }


    async findByCriterias(findTodoDto?:FindTodoDto){
        const take=findTodoDto.take || 2;
        const page=findTodoDto.page || 1;
        const skip=(page-1)*take;
        let data:any;
        if (findTodoDto.statut || findTodoDto.texte){
            const qb=this.postRepository.createQueryBuilder('todo');
            if (findTodoDto.statut) {
                qb.andWhere('todo.status LIKE :statut', {statut: findTodoDto.statut});
            }
            if (findTodoDto.texte) {
                qb.andWhere('todo.name LIKE :texte OR todo.description LIKE :texte', {texte: `%${findTodoDto.texte}%`});
            }
            qb.skip(skip);
            qb.take(take);
            const [result,total]=await qb.getManyAndCount();
            data = [result,total];
        } 
        else {
            data = await this.postRepository.findAndCount({order:{createdAt:'DESC'}, take:take, skip:skip});
        }
        return this.pagination(data,page,take); 
    }




    

    updateTodoWithDTO(id: string, body: todoUpdateDto): TodoModel{
        console.log(id);
        if (!id) throw new NotFoundException();
        const todo = this.todos.find((todo) => todo.id == id);
        //throw exception if not found
        if (!todo) throw new NotFoundException();

        if (!body.name) throw new NotFoundException();
        if (!body.description) throw new NotFoundException();
        if (!body.status) throw new NotFoundException();
        
        todo.description = body.description;
        todo.name = body.name;
        if(! (body.status.match('actif') ||
        (body.status.match('waiting')) ||
        (body.status.match('done')) ))
           throw new NotFoundException("invalid status");
        todo.status = body.status;
        return todo;
    }
    async updateTodoWithDb(id: string, body: todoUpdateDto): Promise<todoEntity>{
        console.log(id);
   
        console.log(body)
        const newTodo = await this.postRepository.preload({ id, ...body });
        if (newTodo) {
            return this.postRepository.save(newTodo);
        } 
        else {
            throw new NotFoundException('Todo not found to be updated!');
        }
    }
    /*getUuid(): string {
        console.log('getUuid');
      return this.uuidProv.getUuid();
    
    }
    */


}