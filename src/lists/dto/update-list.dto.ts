import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateListDto {
    @IsNotEmpty()
    title: string;
    
    @IsNumber()
    position: number;
}