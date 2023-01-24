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
import { AllTodoDto, FindTodoDto } from './todo.findDto';
import { skip } from 'rxjs/operators';

@Injectable()
export class TodoService {
 
    private todos: TodoModel[] = []
    constructor( @InjectRepository(todoEntity)
    private  postRepository: Repository<todoEntity>) {

    }

    //******************************************************* Without DB *********************************************
    listTodosLocal(): TodoModel[] {
        // Todo 2 : Get the todo liste
        console.log('getTodos')
        return(this.todos);
    }
    findTodoLocal(id: string): TodoModel {
        console.log(id);
        if (!id) throw new NotFoundException();
        const todo = this.todos.find((todo) => todo.id == id);
        //throw exception if not found
        if (!todo) throw new NotFoundException();
        return todo;
    }

    addTodoLocal(body: todoDto): TodoModel {
        if (!body.name) throw new NotFoundException();
        if (!body.description) throw new NotFoundException();
        const todo = new TodoModel();
        todo.description = body.description;
        todo.name = body.name;
        console.log(todo);
        this.todos.push(todo);

        return todo;
    }
    updateTodoLocal(id: string, body: todoUpdateDto): TodoModel{
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

    deleteTodoLocal(id: string): TodoModel {
        console.log(id);
        if (!id) throw new NotFoundException();
        const todo = this.todos.find((todo) => todo.id == id);
        //throw exception if not found
        if (!todo) throw new NotFoundException();
        const indexOfTodo = this.todos.indexOf(todo);
        this.todos.splice(indexOfTodo,1);
        return todo;
    }

    //******************************************************* With DB *********************************************

    async listTodosDb(): Promise<todoEntity[]> {
        // Todo 2 : Get the todo liste
        console.log('listTodosDb')
        return await this.postRepository.find();
        }
    
    async findTodoDb(id:string): Promise<todoEntity> {
        // Todo 2 : Get the todo liste
        console.log('findTodoDb')
        return await this.postRepository.findOneBy({id});
        }
    
    async addTodoDb(body: todoDto): Promise<todoEntity> {
        const todo = new TodoModel();
        todo.description = body.description;
        todo.name = body.name;
        console.log(todo);
        return await this.postRepository.save(todo);
    }

    async updateTodoDb(id: string, body: todoUpdateDto): Promise<todoEntity>{
        console.log(id);
        console.log(body);
        const todo = await this.postRepository.findOneBy({id});
        if (!todo) {
            console.error("Todo doesn't exist");
        }
        await this.postRepository.update(id, body);
        return await this.postRepository.findOneBy({id});
  
        /*
        const newTodo = await this.postRepository.preload({ id, ...body });
        if (newTodo) {
            return this.postRepository.save(newTodo);
        } 
        else {
            throw new NotFoundException('Todo not found to be updated!');
        }
        */
    }

    async deleteTodoDb(id: string): Promise<UpdateResult> {
        const result = await this.postRepository.softDelete(id);
        if (!result.affected) {
            throw new NotFoundException('Todo not found!');;
        }
        return result;
    }

    async restoreTodoDb(id:string): Promise<UpdateResult> {
        const result = await this.postRepository.restore(id);
        if (!result.affected) {
            throw new NotFoundException('Todo not found!');;
        }
        return result;
    }

    async countByStatusDb(status:TodoStatusEnum){
        const qb=this.postRepository.createQueryBuilder('todo');
        qb.select('todo.status, COUNT(todo.status) as count');
        qb.where('todo.status LIKE :status', {status: status})
        return qb.getRawMany();
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


    async findByCriteriasDb(findTodoDto?:FindTodoDto){
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
    async getTodosWithPaginationDb(allTodoDto?:AllTodoDto) {
        let data:any;

        const take=allTodoDto.take || 2;
        const page=allTodoDto.page || 1;
        const skip=(page-1)*take;

        const qb=this.postRepository.createQueryBuilder('todo');
        qb.skip(skip);

            qb.take(take);
        const [result,total]=await qb.getManyAndCount();
         data = [result,total];
        data = await this.postRepository.findAndCount({order:{createdAt:'DESC'}, take:take , skip:skip });
        return this.pagination(data,page,take); 

    }

}