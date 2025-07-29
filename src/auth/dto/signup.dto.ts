import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignupDto {
    @IsNotEmpty({ message: 'text_email_required' })
    @IsEmail({}, { message: 'text_invalid_email' })
    email: string;

    @IsNotEmpty({ message: 'text_password_required' })
    @MinLength(6, { message: 'text_invalid_password' })
    password: string;

    @IsNotEmpty({ message: 'text_name_required' })
    name: string;
}