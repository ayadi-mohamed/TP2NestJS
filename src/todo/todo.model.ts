import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoStatusEnum } from './todo.TodoStatusEnum';
import {v4 as Id} from 'uuid';

export class TodoModel {
    public id:string
    public name: string
    public create_date: Date
    public status: TodoStatusEnum
    public description: string

    constructor() {
        this.id //= Id()
        this.name = ''
        this.create_date = new Date()
        this.status = TodoStatusEnum.waiting
        this.description = ''
    }
}