import { IsOptional } from "class-validator";

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
}
