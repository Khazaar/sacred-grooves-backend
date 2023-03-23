import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { CreateUserDto, EditUserDto } from "../src/user/user.dto";
import { TestData } from "./testData";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { CreateArtistTypeDto } from "src/artist-type/artist-type.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";
import { CreateArtistDto, UpdateArtistDto } from "src/artists/artist.dto";
import { UpdateOrganizerDto } from "src/organizer/organizer.dto";
import { CreateEventDto, UpdateEventDto } from "src/event/event.dto";

describe("App auth", () => {
    dotenv.config();
    let app: INestApplication;
    let prismaService: PrismaService;
    const localURL = "http://localhost:3333/";

    const users = [
        TestData.createUserDtoKhazaar,
        TestData.createUserDtoMari,
        TestData.createUserDtoKaya,
        TestData.createUserDtoPeter,
    ];

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
    describe("Auth", () => {
        describe("SignIn / get auth token", () => {
            it("Should get tokens from Auth0", async () => {
                for (const usr of users) {
                    usr.tokenKey =
                        "userAt_" + usr.auth.email.replace("@gmail.com", "");
                    await pactum
                        .spec()
                        .post(`${process.env.AUTH0_ISSUER_URL}oauth/token`)
                        .withBody({
                            grant_type: "password",
                            username: usr.auth.email,
                            password: usr.auth.password,
                            audience: process.env.AUTH0_AUDIENCE,
                            scope: "profile permissions",
                            client_id: process.env.AUTH0_CLIENT_ID,
                            client_secret: process.env.AUTH0_CLIENT_SECRET,
                        })
                        .expectStatus(200)
                        .stores(usr.tokenKey, "access_token");
                }
            });
        });

        describe("Users CRUD", () => {
            pactum.request.setBaseUrl(localURL);
            it("Should create users in DB", async () => {
                for (const usr of users) {
                    const createUser: CreateUserDto = {
                        nickName: usr.nickName,
                        password: usr.auth.password,
                        email: usr.auth.email,
                    };
                    if (usr != TestData.createUserDtoKhazaar) {
                        await pactum
                            .spec()
                            .post("users")
                            .withBody(createUser)
                            .withHeaders({
                                Authorization:
                                    "Bearer $S{" + usr.tokenKey + "}",
                            })
                            .expectStatus(201);
                    } else {
                        const form = new FormData();
                        const avatarPath = "test/images/Khazaar_avatar.jpg";
                        const fileName = "Khazaar_avatar.jpg";
                        const avatarFile = fs.readFileSync(avatarPath);

                        await pactum
                            .spec()
                            .post("users")
                            .withBody(createUser)
                            .withHeaders({
                                Authorization:
                                    "Bearer $S{" + usr.tokenKey + "}",
                            })
                            .expectStatus(201);
                    }
                }
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
                const editUser: EditUserDto = {
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
                        email: TestData.createUserDtoKhazaar.auth.email,
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
                        .expectBodyContains(artistType.artisitTypeName)
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
                            .artisitTypeName,
                    );
            });

            it("Should edit artist type by Id with cud:artistTypes permissions", async () => {
                const editArtistTypeDto: CreateArtistTypeDto = {
                    artisitTypeName: "Type to Delete",
                };
                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKaya.tokenKey +
                            "}",
                    })
                    .withBody(editArtistTypeDto)
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .patch("artist-types/{id}")
                    .expectStatus(200)
                    .expectBodyContains(editArtistTypeDto.artisitTypeName);
            });

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
            it("Should edit music style by Id with moderator role", async () => {
                const editMusicStyleDto: MusicStyleDto = {
                    musicStyleName: "Music style to delete",
                };

                return await pactum
                    .spec()
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_kaya}`,
                    })
                    .patch("music-styles/{id}")
                    .withPathParams({ id: `$S{musicStyleModId}` })
                    .withBody(editMusicStyleDto)
                    .expectStatus(200)
                    .expectBodyContains(editMusicStyleDto.musicStyleName);
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
            it("Should commit me as Artist", async () => {
                return await pactum
                    .spec()
                    .post("artists/")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withBody(TestData.createArtistDtoKhazaar)
                    .stores("khazaarArtistId", "id")
                    .expectStatus(201)
                    .expectBodyContains(
                        TestData.createArtistDtoKhazaar.artistTypes[0],
                    );
            });
            it("Should read all artists", async () => {
                return await pactum
                    .spec()
                    .get("artists/")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .expectStatus(200)
                    .expectJsonLength(1);
            });
            it("Should update my artist profile", async () => {
                const updateArtistDto: UpdateArtistDto = {
                    artistTypes: [TestData.artistTypes[3].artisitTypeName],
                };
                return await pactum
                    .spec()
                    .put("artists/me")
                    .withHeaders({
                        Authorization:
                            "Bearer $S{" +
                            TestData.createUserDtoKhazaar.tokenKey +
                            "}",
                    })
                    .withBody(updateArtistDto)
                    .expectStatus(200)
                    .expectBodyContains(updateArtistDto.artistTypes[0]);
            });
            // it("Should delete my artist profile", async () => {
            //     return await pactum
            //         .spec()
            //         .delete("artists/me")
            //         .withHeaders({
            //             Authorization:
            //                 "Bearer $S{" +
            //                 TestData.createUserDtoKhazaar.tokenKey +
            //                 "}",
            //         })
            //         .expectStatus(200);
            // });
        });
        describe("Organizer CRUD", () => {
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
                    .expectBodyContains(TestData.createUserDtoMari.nickName);
            });
            it("Should update my organizer profile", async () => {
                const updateOrganizerDto: UpdateOrganizerDto = {
                    mainLocation: "New organizer location",
                };
                return pactum
                    .spec()
                    .put("organizers/me")
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
        describe("Event CRUD", () => {
            const createEventDto1: CreateEventDto = {
                name: "Test Event",
                artisitId: pactum.parse(`$S{khazaarArtistId}`),
                location: "Haifa",
                description: "Nice event",
            };
            const createEventDto2: CreateEventDto = {
                name: "Test Event To Delete",
                artisitId: pactum.parse(`$S{khazaarArtistId}`),
                location: "Haifa",
                description: "Nice event",
            };
            it("Should create event for Organizer", async () => {
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
                    .expectBodyContains(createEventDto2.description);
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
                const updateEventDto: UpdateEventDto = {
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

            it("Should get all pending events with rud:evenst permission", async () => {
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
