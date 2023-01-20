import { TodoStatusEnum } from "./todo.TodoStatusEnum";
import { PartialType} from '@nestjs/mapped-types';
import { todoDto } from './todo.todoDto';
import { IsEnum, IsIn } from "class-validator";

export class todoUpdateDto extends PartialType(todoDto) {
    //@IsIn(['waiting', 'done', 'actif'])
    @IsEnum(TodoStatusEnum)
    status?: TodoStatusEnum;
}


