import { IsOptional, IsEnum } from "class-validator";
import { TodoStatusEnum } from "./todo.TodoStatusEnum";

export class FindTodoDto {

    @IsOptional()
    texte?: string;
    
    @IsOptional()
    @IsEnum(TodoStatusEnum)
    statut?: string;
  
    take?: number;
    
    page?: number;
  }
  