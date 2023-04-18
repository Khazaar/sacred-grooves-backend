import { IsNotEmpty, IsOptional } from "class-validator";

export class OrganizerDto {
    @IsOptional()
    mainLocation: string;
}
