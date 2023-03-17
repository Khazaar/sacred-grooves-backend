import { CreateArtistTypeDto } from "src/artist-type/artist-type.dto";
import { CreateArtistDto } from "src/artists/artist.dto";
import { AuthDto } from "src/auth/auth.dto";
import { CreateOrganizerDto } from "src/organizer/organizer.dto";
import { CreateUserDto } from "src/user/user.dto";

export abstract class TestData {
    // Artist
    public static authDtoKhazaar: AuthDto = {
        email: "khazaar@gmail.com",
        password: "asdfasdfasdg345",
    };
    public static createUserDtoKhazaar: CreateUserDto = {
        nickName: "Khazaar",
    };
    public static createArtistDtoKhazaar: CreateArtistDto = {
        style: "House",
    };
    // Organizer
    public static authDtoMari: AuthDto = {
        email: "mari@gmail.com",
        password: "sdfasdasyeer",
    };
    public static createUserDtoMari: CreateUserDto = {
        nickName: "Marii",
    };
    public static createOrganizerDtoMari: CreateOrganizerDto = {
        mainLocation: "Siberia",
    };
    // Moderator
    public static authDtoKaya: AuthDto = {
        email: "kaya@gmail.com",
        password: "sdfasdasyeer",
    };
    public static createUserDtoKaya: CreateUserDto = {
        nickName: "Kaya the bird",
    };
    // Student
    public static authDtoPeter: AuthDto = {
        email: "peter@gmail.com",
        password: "56453yrte434u5786yrt",
    };
    public static createUserDtoPeter: CreateUserDto = {
        nickName: "Peter Power",
    };

    public static artistTypes: CreateArtistTypeDto[] = [
        {
            artisitTypeName: "DJ",
        },
        {
            artisitTypeName: "Singer",
        },
        {
            artisitTypeName: "Percussion player",
        },
        {
            artisitTypeName: "Guitar player",
        },
        {
            artisitTypeName: "Electronic music producer",
        },
        {
            artisitTypeName: "Painter",
        },
        {
            artisitTypeName: "Ceremony leader",
        },
        {
            artisitTypeName: "Dancer",
        },
        {
            artisitTypeName: "Face painter",
        },
    ];
}
