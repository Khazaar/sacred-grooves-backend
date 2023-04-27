import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { UserDto } from "../src/user/user.dto";
import { ProfileDtoTest, TestData } from "./testData";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { ArtistTypeDto } from "src/artist-type/artist-type.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";
import { ArtistDto } from "src/artists/artist.dto";
import { OrganizerDto } from "src/organizer/organizer.dto";
import { EventDto } from "../src/event/event.dto";

describe("e2e tests", () => {
    dotenv.config();
    let app: INestApplication;
    let prismaService: PrismaService;
    const localURL = "http://localhost:3333/";

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        await app.listen(3333);
        prismaService = app.get(PrismaService);
        await prismaService.cleadDb();
    });
    afterAll(async () => {
        await app.close();
        await prismaService.$disconnect();
    });
    beforeEach(() => {});
    describe("e2e tests", () => {
        describe("SignIn / get auth token", () => {
            it("Should get tokens from Auth0", async () => {
                for (const profile of TestData.profiles) {
                    await pactum
                        .spec()
                        .post(`${process.env.AUTH0_ISSUER_URL}oauth/token`)
                        .withBody({
                            grant_type: "password",
                            username: profile.email,
                            password: profile.password,
                            audience: process.env.AUTH0_AUDIENCE,
                            scope: "profile permissions",
                            client_id: process.env.AUTH0_CLIENT_ID,
                            client_secret: process.env.AUTH0_CLIENT_SECRET,
                        })
                        .expectStatus(200)
                        .stores(profile.tokenKey, "access_token");
                }
            }, 10000);
        });
        describe("Profiles CRUD", () => {
            pactum.request.setBaseUrl(localURL);
            it("Should create profiles in DB", async () => {
                for (const profile of TestData.profiles) {
                    await pactum
                        .spec()
                        .post("profiles/me")
                        .withHeaders({
                            Authorization:
                                "Bearer $S{" + profile.tokenKey + "}",
                        })
                        .expectStatus(201);
                }
            });
        });
        describe("Users CRUD", () => {
            it("Should create users in DB", async () => {
                for (const usr of TestData.users) {
                    const createUser: UserDto = {
                        nickName: usr.nickName,
                        email: usr.email,
                    };
                    usr.mapLocation &&
                        (createUser.mapLocation = usr.mapLocation);

                    await pactum
                        .spec()
                        .post("users")
                        .withBody(createUser)
                        .withHeaders({
                            Authorization: "Bearer $S{" + usr.tokenKey + "}",
                        })
                        .expectStatus(201);
                }
            });

            it("Should upload avatar", async () => {
                // const form = new FormData();
                // const avatarPath = "test/images/Khazaar_avatar.jpg";
                // const fileName = "Khazaar_avatar.jpg";
                // const avatarFile = fs.readFileSync(avatarPath);
                // form.append('file', avatarFile, { filename: 'a.txt' });
                // await pactum
                //     .spec()
                //     .post("users")
                //     .withBody(createUser)
                //     .withHeaders({
                //         Authorization: "Bearer $S{" + usr.tokenKey + "}",
                //     })
                //     .withMultiPartFormData(form)
                //     .expectStatus(201);
            });

            it("Should get all users from DB with read:users permissions", async () => {
                return await pactum
                    .spec()
                    .get("users")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .expectStatus(200);
            });
            it("Should not get all users from DB without read:users permissions", async () => {
                return await pactum
                    .spec()
                    .get("users")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .expectStatus(403);
            });
            it("Should get user from DB by token (get me)", async () => {
                return await pactum
                    .spec()
                    .get("users/me")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .expectStatus(200)
                    .expectBodyContains(TestData.createUserDtoKaya.nickName);
            });
            it("Should patch user in DB by token (patch me)", async () => {
                const editUser: UserDto = {
                    nickName: "Kaya Edited",
                };
                return await pactum
                    .spec()
                    .patch("users/me")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .withBody(editUser)
                    .expectStatus(200)
                    .expectBodyContains(editUser.nickName);
            });
            it("Should get user from DB by email with read:users permissions", async () => {
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .withBody({
                        email: TestData.profileKhazaar.email,
                    })
                    .get("users/email")
                    .expectStatus(200)
                    .expectBodyContains(TestData.createUserDtoKhazaar.nickName);
            });
        });
        describe("Artist types CRUD", () => {
            it("Should create artist type with cud:artistTypes permissions", async () => {
                for (const artistType of TestData.artistTypes) {
                    await pactum
                        .spec()
                        .post("artist-types")
                        .withHeaders({
                            Authorization:
                                "Bearer $S{" +
                                TestData.createUserDtoKaya.tokenKey +
                                "}",
                        })
                        .withBody(artistType)
                        .expectStatus(201)

                        .stores("artistTypeModId", "id");
                }
            });
            it("Should not create artist type without cud:artistTypes permissions", async () => {
                return await pactum
                    .spec()
                    .post("artist-types")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withBody(TestData.artistTypes[0])
                    .expectStatus(403);
            });

            it("Should get all artist types", async () => {
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .get("artist-types/")
                    .expectStatus(200)
                    .expectJsonLength(TestData.artistTypes.length);
            });

            it("Should get artist type by Id ", async () => {
                await await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .get("artist-types/{id}")
                    .expectStatus(200)
                    .expectBodyContains(
                        TestData.artistTypes[TestData.artistTypes.length - 1]
                            .artistTypeName,
                    );
            });

            // it("Should edit artist type by Id with cud:artistTypes permissions", async () => {
            //     const editArtistTypeDto: ArtistTypeDto = {
            //         artistTypeName: "Type to Delete",
            //     };
            //     return await pactum
            //         .spec()
            //         .withHeaders({
            //             Authorization:
            //                 "Bearer $S{" +
            //                 TestData.createUserDtoKaya.tokenKey +
            //                 "}",
            //         })
            //         .withBody(editArtistTypeDto)
            //         .withPathParams({ id: `$S{artistTypeModId}` })
            //         .patch("artist-types/{id}")
            //         .expectStatus(200)
            //         .expectBodyContains(editArtistTypeDto.artistTypeName);
            // });

            it("Should delete artist type by Id with cud:artistTypes permissions", async () => {
                await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .delete("artist-types/{id}")
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .expectStatus(200);

                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .get("artist-types/")
                    .expectStatus(200)
                    .expectJsonLength(TestData.artistTypes.length - 1);
            });
            it("Should return error trying to delete artist type by wrong Id / 99999999", async () => {
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .delete("artist-types/{id}")
                    .withPathParams({ id: `99999999` })
                    .expectStatus(500);
            });
            it("Should not delete artist type by Id without cud:artistTypes permissions", async () => {
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_khazaar}`,
                    })
                    .delete("artist-types/{id}")
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .expectStatus(403);
            });
        });
        describe("Music style CRUD", () => {
            it("Should create music style with with cud:musicStyles permissions", async () => {
                for (const musicStyle of TestData.musicStyles) {
                    await pactum
                        .spec()
                        .withHeaders({
                            Authorization:
                                "Bearer $S{" +
                                TestData.createUserDtoKaya.tokenKey +
                                "}",
                        })
                        .post("music-styles/")
                        .withBody(musicStyle)
                        .expectStatus(201)
                        .stores("musicStyleModId", "id")
                        .expectBodyContains(musicStyle.musicStyleName);
                }
            });
            it("Should not create music style without moderator role", async () => {
                return await pactum
                    .spec()
                    .post("music-styles/")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withBody(TestData.musicStyles[0])
                    .expectStatus(403);
            });
            it("Should get all music styles with moderator role", async () => {
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .get("music-styles/")
                    .expectStatus(200)
                    .expectJsonLength(TestData.musicStyles.length);
            });

            it("Should get music style by Id with moderator role", async () => {
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .get("music-styles/{id}")
                    .withPathParams({ id: `$S{musicStyleModId}` })
                    .expectStatus(200)
                    .expectBodyContains(
                        TestData.musicStyles[TestData.musicStyles.length - 1]
                            .musicStyleName,
                    );
            });
            it.skip("Should edit music style by Id with moderator role", async () => {
                // const editMusicStyleDto: MusicStyleDto = {
                //     musicStyleName: "Music style to delete",
                // };
                // return await pactum
                //     .spec()
                //     .withHeaders({
                //         Authorization: `Bearer $S{userAt_kaya}`,
                //     })
                //     .patch("music-styles/{id}")
                //     .withPathParams({ id: `$S{musicStyleModId}` })
                //     .withBody(editMusicStyleDto)
                //     .expectStatus(200)
                //     .expectBodyContains(editMusicStyleDto.musicStyleName);
            });

            it("Should delete music style by Id with moderator role", async () => {
                await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .delete("music-styles/{id}")
                    .withPathParams({ id: `$S{musicStyleModId}` })
                    .expectStatus(200);

                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .get("music-styles/")
                    .expectStatus(200)
                    .expectJsonLength(TestData.musicStyles.length - 1);
            });
        });
        describe("Artists CRUD", () => {
            it("Should claim artist role", async () => {
                return await pactum
                    .spec()
                    .post("profiles/me/role")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withQueryParams({ targetRole: "artist" })
                    // .withBody(TestData.createArtistDtoKhazaar)
                    // .stores("khazaarArtistId", "id")
                    .expectStatus(201)
                    .expectBodyContains("isSelected");
            });
            it("Should update my artist profile", async () => {
                const updateArtistDto: ArtistDto = {
                    artistTypes: [
                        {
                            artistTypeName:
                                TestData.artistTypes[3].artistTypeName,
                            isSelected: true,
                        },
                    ],
                    musicStyles: [
                        {
                            musicStyleName:
                                TestData.musicStyles[3].musicStyleName,
                            isSelected: true,
                        },
                    ],
                };
                return await pactum
                    .spec()
                    .patch("artists/me")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withBody(updateArtistDto)
                    .expectStatus(200)
                    .inspect();
            });
            it.skip("Should delete my artist profile", async () => {
                await pactum
                    .spec()
                    .delete("artists/me")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .expectStatus(200);
            });
        });
        describe.skip("Organizer CRUD", () => {
            it("Should commit me as Organizer", async () => {
                return pactum
                    .spec()
                    .post("organizers/")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoMari.tokenKey +
                            "}",
                    })
                    .withBody(TestData.createOrganizerDtoMari)
                    .stores("mariOrganizerId", "id")
                    .expectStatus(201)
                    .expectBodyContains(
                        TestData.createOrganizerDtoMari.mainLocation,
                    );
            });
            it("Should update my organizer profile", async () => {
                const updateOrganizerDto: OrganizerDto = {
                    mainLocation: "New organizer location",
                };
                return pactum
                    .spec()
                    .patch("organizers/me")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoMari.tokenKey +
                            "}",
                    })
                    .withBody(updateOrganizerDto)
                    .expectStatus(200)
                    .expectBodyContains(updateOrganizerDto.mainLocation);
            });
            it("Should read all organizers", async () => {
                return pactum
                    .spec()
                    .get("organizers")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .expectStatus(200)
                    .expectJsonLength(1);
            });
        });
        describe.skip("Event CRUD", () => {
            const createEventDto1: EventDto = {
                name: "Test Event",
                artisitId: pactum.parse(`$S{khazaarArtistId}`),
                location: "Haifa",
                description: "Nice event",
                mapLocation: {
                    name: "Ecstatic Dance",
                    latitude: 123,
                    longitude: 234,
                    address: "Good address",
                    city: "Paris",
                    country: "France",
                },
            };
            const createEventDto2: EventDto = {
                name: "Test Event To Delete",
                artisitId: pactum.parse(`$S{khazaarArtistId}`),
                location: "Haifa",
                description: "Nice event",
            };
            it("Should create event for Organizer", async () => {
                return pactum
                    .spec()
                    .post("events")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoMari.tokenKey +
                            "}",
                    })
                    .withBody(createEventDto1)
                    .stores("mariEventId2", "id")
                    .expectStatus(201)
                    .expectBodyContains(createEventDto1.description)
                    .inspect();
            });
            it("Should not create event for not Organizer", async () => {
                return (
                    pactum
                        .spec()
                        .post("events")
                        .withHeaders({
                            Authorization:
                                "Bearer $S{" +
                                TestData.createUserDtoKaya.tokenKey +
                                "}",
                        })
                        .withBody(createEventDto1)
                        //.expectStatus(404)
                        .expectBody("")
                );
            });

            it("Should update event by ID for Organizer", async () => {
                //  Create event2
                await pactum
                    .spec()
                    .post("events")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoMari.tokenKey +
                            "}",
                    })
                    .withBody(createEventDto1)
                    .stores("mariEventId1", "id")
                    .expectStatus(201);
                const updateEventDto: EventDto = {
                    name: "New event name",
                    description: "New event description",
                };
                return pactum
                    .spec()
                    .patch("events/{id}")
                    .withPathParams({ id: `$S{mariEventId1}` })
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoMari.tokenKey +
                            "}",
                    })
                    .withBody(updateEventDto)
                    .expectStatus(200)
                    .expectBodyContains(updateEventDto.name);
            });

            it("Should get all pending events with rud:events permission", async () => {
                return pactum
                    .spec()
                    .get("events/pending")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .expectStatus(200)
                    .expectJsonLength(2);
            });

            it("Should not get all pending events without rud:evenst permission", async () => {
                return pactum
                    .spec()
                    .get("events/pending")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .expectStatus(403);
            });

            it("Should approve event by ID with rud:evenst permission", async () => {
                return pactum
                    .spec()
                    .patch("events/pending/{id}")
                    .withPathParams({ id: `$S{mariEventId1}` })
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .expectStatus(200);
            });

            it("Should read all approved events for everyone", async () => {
                return pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .get("events")
                    .expectStatus(200)
                    .expectJsonLength(1);
            });

            it("Should delete pendind event by ID with rud:evenst permission", async () => {
                return pactum
                    .spec()
                    .delete("events/pending/{id}")
                    .withPathParams({ id: `$S{mariEventId2}` })
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .expectStatus(200);
            });
        });
    });
});
