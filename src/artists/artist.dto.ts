import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateArtistDto {
    @IsNotEmpty()
    userId: number;
    @IsOptional()
    style: string;
}

export class EditArtistDto {
    @IsOptional()
    style?: string;
}
