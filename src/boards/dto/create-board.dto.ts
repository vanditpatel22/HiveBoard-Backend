import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    title: string;
  
    @IsOptional()
    description: string;
  
    @IsOptional()
    visibility: string;
  }
  