import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateBoardDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    visibility: string;
  }
