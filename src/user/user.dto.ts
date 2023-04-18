import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { MapLocation } from "../enums";

export class UserDto {
    @IsOptional()
    email?: string;
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
