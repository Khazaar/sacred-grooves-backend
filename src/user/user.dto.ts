import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsOptional()
    nickName?: string;
    @IsOptional()
    firstName?: string;
    @IsOptional()
    lastName?: string;
    @IsOptional()
    telegramName?: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    email: string;
}

export class EditUserDto {
    @IsOptional()
    email?: string;
    @IsOptional()
    nickName?: string;
    @IsOptional()
    password?: string;
    @IsOptional()
    firstName?: string;
    @IsOptional()
    lastName?: string;
    @IsOptional()
    telegramName?: string;
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    roles?: string[];
}
