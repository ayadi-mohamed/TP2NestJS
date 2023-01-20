import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class todoDto {
    @IsNotEmpty({
        message:"name field is empty"
    })
    @MinLength(3)
    @MaxLength(10)
    name: string;
    @IsNotEmpty()
    @MinLength(10)
    description: string;
}