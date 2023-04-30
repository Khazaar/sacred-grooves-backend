import { IsNotEmpty, IsString } from "class-validator";

export class ArtistTypeDto {
    @IsNotEmpty()
    @IsString()
    artistTypeName: string;
    isSelected?: boolean;
}
