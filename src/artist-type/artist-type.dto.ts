import { IsNotEmpty, IsString } from "class-validator";

export class CreateArtistTypeDto {
    @IsNotEmpty()
    @IsString()
    artisitTypeName: string;
}