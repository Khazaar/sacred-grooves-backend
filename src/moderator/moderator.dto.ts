import { IsEmail, IsNumber, IsOptional } from "class-validator";

export class GrantModeratorDto {
    @IsOptional()
    @IsNumber()
    userId?: string;
    @IsOptional()
    @IsEmail()
    userEmail?: string;
}
