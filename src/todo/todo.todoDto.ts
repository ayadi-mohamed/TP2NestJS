import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { ExceptionEnum } from "./todo.exceptionEnum";

export class todoDto {
    @IsNotEmpty({
        message: ExceptionEnum.isEmpty
    })
    @MinLength(3)
    @MaxLength(10)
    name: string;
    @IsNotEmpty()
    @MinLength(10)
    description: string;
}