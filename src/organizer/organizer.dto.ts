import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrganizerDto {
    @IsOptional()
    mainLocation: string;
}

export class EditOrganizerDto {
    @IsOptional()
    mainLocation?: string;
}
