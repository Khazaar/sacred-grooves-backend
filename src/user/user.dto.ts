import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { MapLocation } from "../enums";

export class CreateUserDto {
    @IsOptional()
    password: string;
    @IsNotEmpty()
    email: string;
    @IsOptional()
    nickName?: string;
    @IsOptional()
    firstName?: string;
    @IsOptional()
    lastName?: string;
    @IsOptional()
    telegramName?: string;
    @IsOptional()
    mapLocation?: MapLocation;
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
    mapLocation?: MapLocation;
}
