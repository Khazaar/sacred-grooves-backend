import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    artisitId: number;
    @IsNotEmpty()
    location: string;
    @IsOptional()
    dateStart?: Date;
    @IsOptional()
    dateEnd?: Date;
}

export class UpdateEventDto {
    @IsOptional()
    name?: string;
    @IsOptional()
    description?: string;
    @IsOptional()
    artisitId?: number;
    @IsOptional()
    location?: string;
    @IsOptional()
    dateStart?: Date;
    @IsOptional()
    dateEnd?: Date;
}
