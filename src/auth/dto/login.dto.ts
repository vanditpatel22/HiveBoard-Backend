import { IsEmail, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'text_invalid_email' })
    email: string;
    @MinLength(6)
    password: string;
  }