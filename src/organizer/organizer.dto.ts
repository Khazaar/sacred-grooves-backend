import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrganizerDto {
    @IsNotEmpty()
    userId: number;
    @IsOptional()
    mainLocation: string;
}

export class EditOrganizerDto {
    @IsOptional()
    mainLocation?: string;
}
