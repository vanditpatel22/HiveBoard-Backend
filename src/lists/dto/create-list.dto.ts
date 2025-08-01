import { IsNotEmpty, IsNumber } from "class-validator";


export class CreateListDto {
    @IsNotEmpty()
    title: string;

    @IsNumber()
    position: number;
}
