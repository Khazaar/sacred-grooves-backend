import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class ArtistDto {
    @IsArray()
    @IsOptional()
    artistTypes?: string[];
    @IsArray()
    @IsOptional()
    musicStyles?: string[];
}
