import { IsNotEmpty, IsString } from "class-validator";

export class MusicStyleDto {
    @IsNotEmpty()
    @IsString()
    musicStyleName: string;
    isSelected?: boolean;
}
