import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateArtistDto {
    @IsArray()
    @IsNotEmpty()
    artistTypes: string[];
    @IsArray()
    @IsNotEmpty()
    musicStyles: string[];
}

export class UpdateArtistDto {
    @IsArray()
    @IsOptional()
    artistTypes?: string[];
    @IsArray()
    @IsOptional()
    musicStyles?: string[];
}
