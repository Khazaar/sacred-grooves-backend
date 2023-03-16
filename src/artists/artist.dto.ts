import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateArtistDto {
    @IsOptional()
    style: string;
}

export class EditArtistDto {
    @IsOptional()
    style?: string;
}
