import { IsNotEmpty, IsOptional } from "class-validator";
import { MapLocation } from "../enums";

export class EventDto {
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
    @IsOptional()
    mapLocation?: MapLocation;
}
