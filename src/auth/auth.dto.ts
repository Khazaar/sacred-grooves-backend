import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
    @IsOptional()
    id?: number;
}
