import { CreateArtistTypeDto } from "src/artist-type/artist-type.dto";
import { CreateArtistDto } from "src/artists/artist.dto";
import { AuthDto } from "src/authz/auth.dto";
import { CreateEventDto } from "src/event/event.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";
import { CreateOrganizerDto } from "src/organizer/organizer.dto";
import { CreateUserDto } from "../src/user/user.dto";
import { MapLocation } from "../src/enums";

class CreateUserDtoTest {
    nickName?: string;
    access_token?: string;
    tokenKey?: string;
    auth: AuthDto;
    mapLocation?: MapLocation;
}

export abstract class TestData {
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
    // Users
    public static createUserDtoKhazaar: CreateUserDtoTest = {
        nickName: "Khazaar",
        auth: {
            email: "khazaar@gmail.com",
            password: "asdfasd_fasdg345",
        },
        mapLocation: {
            name: "Bass house",
            latitude: 55.5,
            longitude: 55.5,
            address: "Haneedusim 101",
            city: "Haifa",
            country: "Israel",
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
        artistTypes: [
            TestData.artistTypes[0].artisitTypeName,
            TestData.artistTypes[1].artisitTypeName,
        ],
        musicStyles: [
            TestData.musicStyles[0].musicStyleName,
            TestData.musicStyles[1].musicStyleName,
        ],
    };

    // Organizer
    public static createOrganizerDtoMari: CreateOrganizerDto = {
        mainLocation: "Siberia",
    };
    // Moderator
    // Student
}
