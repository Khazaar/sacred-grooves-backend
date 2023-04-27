import { MusicStyle } from "@prisma/client";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { ArtistTypeDto } from "src/artist-type/artist-type.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";

export class ArtistDto {
    @IsArray()
    @IsOptional()
    artistTypes?: ArtistTypeDto[];
    @IsArray()
    @IsOptional()
    musicStyles?: MusicStyleDto[];
}
