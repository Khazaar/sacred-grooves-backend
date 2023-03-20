import { CreateArtistTypeDto } from "src/artist-type/artist-type.dto";
import { CreateArtistDto } from "src/artists/artist.dto";
import { AuthDto } from "src/authz/auth.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";
import { CreateOrganizerDto } from "src/organizer/organizer.dto";
import { CreateUserDto } from "../src/user/user.dto";

class CreateUserDtoTest {
    nickName?: string;
    access_token?: string;
    tokenKey?: string;
    auth: AuthDto;
}

export abstract class TestData {
    // Users
    public static createUserDtoKhazaar: CreateUserDtoTest = {
        nickName: "Khazaar",
        auth: {
            email: "khazaar@gmail.com",
            password: "asdfasd_fasdg345",
        },
    };

    public static createUserDtoMari: CreateUserDtoTest = {
        nickName: "Marii",
        auth: {
            email: "mari@gmail.com",
            password: "sdfas!dasyeer2",
        },
    };

    public static createUserDtoKaya: CreateUserDtoTest = {
        nickName: "Kaya the bird",
        auth: {
            email: "kaya@gmail.com",
            password: "sdfas33%$dasyeer",
        },
    };

    public static createUserDtoPeter: CreateUserDtoTest = {
        nickName: "Peter Power",
        auth: {
            email: "peter@gmail.com",
            password: "5645&^%3yrte434u5786yrt",
        },
    };

    // Artist
    public static createArtistDtoKhazaar: CreateArtistDto = {
        style: "House",
    };

    // Organizer
    public static createOrganizerDtoMari: CreateOrganizerDto = {
        mainLocation: "Siberia",
    };
    // Moderator
    // Student

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
        {
            artisitTypeName: "Type to edit",
        },
    ];

    public static musicStyles: MusicStyleDto[] = [
        {
            musicStyleName: "House",
        },
        {
            musicStyleName: "Techno",
        },
        {
            musicStyleName: "Trance",
        },
        {
            musicStyleName: "Dubstep",
        },
        {
            musicStyleName: "Drum and Bass",
        },

        {
            musicStyleName: "Bass",
        },
        {
            musicStyleName: "Chill",
        },
        {
            musicStyleName: "Music style to edit",
        },
    ];
}
