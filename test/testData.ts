import { ArtistTypeDto } from "src/artist-type/artist-type.dto";
import { ArtistDto } from "src/artists/artist.dto";
import { AuthDto } from "src/authz/auth.dto";
import { EventDto } from "src/event/event.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";
import { OrganizerDto } from "src/organizer/organizer.dto";
import { UserDto } from "../src/user/user.dto";
import { MapLocation } from "../src/enums";
import { ProfileDto } from "../src/profile/profile.dto";

class CreateUserDtoTest {
    nickName?: string;
    access_token?: string;
    tokenKey?: string;
    mapLocation?: MapLocation;
    email?: string;
}
export class ProfileDtoTest extends ProfileDto {
    password: string;
    tokenKey?: string;
    email?: string;
}

export abstract class TestData {
    public static profileKhazaar: ProfileDtoTest = {
        password: "asdfasd_fasdg345",
        auth0sub: "auth0|6416f1a272c885b94f3b2c8e",
        tokenKey: "userAt_khazaar",
        email: "khazaar@gmail.com",
    };
    public static profileMari: ProfileDtoTest = {
        password: "sdfas!dasyeer2",
        auth0sub: "auth0|6417004d72c885b94f3b2d28",
        tokenKey: "userAt_mari",
        email: "mari@gmail.com",
    };
    public static profileKaya: ProfileDtoTest = {
        password: "sdfas33%$dasyeer",
        auth0sub: "auth0|64170068936cc041cfc21971",
        tokenKey: "userAt_kaya",
        email: "kaya@gmail.com",
    };
    public static profilePeter: ProfileDtoTest = {
        password: "5645&^%3yrte434u5786yrt",
        auth0sub: "auth0|6417007f72c885b94f3b2d2c",
        tokenKey: "userAt_peter",
        email: "peter@gmail.com",
    };

    public static profiles = [
        this.profileKhazaar,
        this.profileMari,
        this.profileKaya,
        this.profilePeter,
    ];
    public static artistTypes: ArtistTypeDto[] = [
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

    // Profiles

    // Users
    public static createUserDtoKhazaar: CreateUserDtoTest = {
        nickName: "Khazaar",
        tokenKey: "userAt_khazaar",
        email: "khazaar@gmail.com",

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
        tokenKey: "userAt_mari",
        email: "mari@gmail.com",
    };

    public static createUserDtoKaya: CreateUserDtoTest = {
        nickName: "Kaya the bird",
        tokenKey: "userAt_kaya",
        email: "kaya@gmail.com",
    };

    public static createUserDtoPeter: CreateUserDtoTest = {
        nickName: "Peter Power",
        tokenKey: "userAt_peter",
        email: "peter@gmail.com",
    };

    public static users = [
        TestData.createUserDtoKhazaar,
        TestData.createUserDtoMari,
        TestData.createUserDtoKaya,
        TestData.createUserDtoPeter,
    ];

    // Artist
    public static createArtistDtoKhazaar: ArtistDto = {
        artistTypes: [
            { artistTypeName: TestData.artistTypes[0].artistTypeName },
            { artistTypeName: TestData.artistTypes[1].artistTypeName },
        ],
        musicStyles: [
            { musicStyleName: TestData.musicStyles[0].musicStyleName },
            { musicStyleName: TestData.musicStyles[1].musicStyleName },
        ],
    };

    // Organizer
    public static createOrganizerDtoMari: OrganizerDto = {
        mainLocation: "Siberia",
    };
    // Moderator
    // Student
}
