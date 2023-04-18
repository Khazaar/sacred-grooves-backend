import { IsNotEmpty, IsOptional } from "class-validator";
import { ArtistDto } from "../artists/artist.dto";
import { OrganizerDto } from "../organizer/organizer.dto";
import { UserDto } from "../user/user.dto";

export class ProfileDto {
    @IsNotEmpty()
    auth0sub: string;
    @IsOptional()
    user?: UserDto;
    @IsOptional()
    organizer?: OrganizerDto;
    @IsOptional()
    artist?: ArtistDto;
}
