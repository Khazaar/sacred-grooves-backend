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
            artistTypeName: "DJ",
        },
        {
            artistTypeName: "Singer",
        },
        {
            artistTypeName: "Percussion player",
        },
        {
            artistTypeName: "Guitar player",
        },
        {
            artistTypeName: "Electronic music producer",
        },
        {
            artistTypeName: "Painter",
        },
        {
            artistTypeName: "Ceremony leader",
        },
        {
            artistTypeName: "Dancer",
        },
        {
            artistTypeName: "Face painter",
        },
        {
            artistTypeName: "Type to edit",
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
            TestData.artistTypes[0].artistTypeName,
            TestData.artistTypes[1].artistTypeName,
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
