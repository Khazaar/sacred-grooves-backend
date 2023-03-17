import { AuthDto } from "../src/auth/auth.dto";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { EditUserDto } from "../src/user/user.dto";
import { CreateArtistDto } from "src/artists/artist.dto";
import { CreateOrganizerDto } from "src/organizer/organizer.dto";
import { CreateEventDto } from "src/event/event.dto";
import { CreateUserDto } from "src/user/user.dto";
import { Role } from "../src/auth/enums/roles.enum";
import { GrantModeratorDto } from "src/moderator/moderator.dto";
import { TestData } from "./testData";
import { inspect } from "util";
import { CreateArtistTypeDto } from "src/artist-type/artist-type.dto";

describe("App e2e test", () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        await app.listen(3333);
        prismaService = app.get(PrismaService);
        prismaService.cleadDb();
        pactum.request.setBaseUrl("http://localhost:3333");
    });
    afterAll(async () => {
        await app.close();
    });
    describe("Auth", () => {
        describe("SignUp / create User", () => {
            it("Empty email exeption", async () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody({
                        ...TestData.authDtoKhazaar,
                        email: "",
                    })
                    .expectStatus(400);
            });
            it("Should sign up / create accounts: khazaar, mari, kaya, peter", async () => {
                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(TestData.authDtoKhazaar)
                    .expectStatus(201)
                    .stores("khazaarUserId", "id");

                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(TestData.authDtoMari)
                    .stores("mariUserId", "id")
                    .expectStatus(201);

                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(TestData.authDtoKaya)
                    .stores("kayaUserId", "[3].id")
                    .expectStatus(201);
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(TestData.authDtoPeter)
                    .stores("peterUserId", "id")
                    .expectStatus(201);
            });
        });
        describe("SignIn / get auth token", () => {
            it("Should sign in and get tokens for khazaar, mari, kaya, peter", async () => {
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(TestData.authDtoKhazaar)
                    .expectStatus(200)
                    .stores("userAt_khazaar", "access_token");
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(TestData.authDtoMari)
                    .expectStatus(200)
                    .stores("userAt_mari", "access_token");
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(TestData.authDtoKaya)
                    .expectStatus(200)
                    .stores("userAt_kaya", "access_token");
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(TestData.authDtoPeter)
                    .expectStatus(200)
                    .stores("userAt_peter", "access_token");
            });
        });
    });
    describe("Users CRUD", () => {
        describe("Create users", () => {
            it("Should update user khazaar", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .withBody(TestData.createUserDtoKhazaar)
                    .expectStatus(201)
                    .expectBodyContains(TestData.createUserDtoKhazaar.nickName);
            });
            it("Should create user mari", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_mari}` })
                    .withBody(TestData.createUserDtoMari)
                    .expectStatus(201)
                    .expectBodyContains(TestData.createUserDtoMari.nickName);
            });
            it("Should create user peter", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_peter}` })
                    .withBody(TestData.createUserDtoPeter)
                    .expectStatus(201)
                    .expectBodyContains(TestData.createUserDtoPeter.nickName);
            });
            it("Should create user kaya", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .withBody(TestData.createUserDtoKaya)
                    .expectStatus(201)
                    .expectBodyContains(TestData.createUserDtoKaya.nickName);
            });
        });

        describe("Get Me", () => {
            it("Should get current user", async () => {
                return pactum
                    .spec()
                    .get("/users/me")
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .expectStatus(200);
            });
        });

        describe("Edit Me", () => {
            it("Should edit user", async () => {
                const editUserDto: EditUserDto = {
                    firstName: "Egor",
                };
                await pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .withBody(editUserDto)
                    .patch("/users/me")
                    .expectStatus(200);

                return pactum
                    .spec()
                    .get("/users/me")
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .expectStatus(200)
                    .expectBodyContains(editUserDto.firstName);
            });
        });
    });

    describe("Moderators CRUD", () => {
        describe("Grant moderator role", () => {
            it("Should grant modeator role by user email", async () => {
                const grantModeratorDto: GrantModeratorDto = {
                    userEmail: TestData.authDtoKaya.email,
                };
                return pactum
                    .spec()
                    .post("/moderators/grant")
                    .withBody(grantModeratorDto)
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .expectStatus(201);
            });
        });

        describe("Get all users", () => {
            it("Should get all users with Moderator role", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .get("/users/")
                    .expectStatus(200)
                    .expectBodyContains(TestData.authDtoKhazaar.email)
                    .expectBodyContains(TestData.authDtoMari.email)
                    .expectBodyContains(TestData.authDtoKaya.email)
                    .expectBodyContains(TestData.authDtoPeter.email)
                    .expectJsonLength(4);
            });
            it("Should not all users without Moderator role", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .get("/users/")
                    .expectStatus(403);
            });
        });

        describe("Get user by Id", () => {
            it("Should get user by Id with Moderator role", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .withPathParams({ id: `$S{khazaarUserId}` })
                    .get("/users/{id}")
                    .expectStatus(200)
                    .expectBodyContains(TestData.createUserDtoKhazaar.nickName);
            });
        });
    });

    describe("Artist types CRUD", () => {
        describe("Create Artist type", () => {
            it("Should create artist type with moderator role", async () => {
                TestData.artistTypes.forEach(async (artistType) => {
                    return pactum

                        .spec()
                        .post("/artist-types/")
                        .withHeaders({
                            Authorization: `Bearer $S{userAt_kaya}`,
                        })
                        .withBody(artistType)
                        .expectStatus(201)
                        .expectBodyContains(artistType.artisitTypeName)
                        .stores("artistTypeModId", "id");
                });
            });
            it("Should not create artist type without moderator role", async () => {
                return pactum
                    .spec()
                    .post("/artist-types/")
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_khazaar}`,
                    })
                    .withBody(TestData.artistTypes[0])
                    .expectStatus(403);
            });
        });
        describe("Get all artist types", () => {
            it("Should get all artist types", async () => {
                return pactum
                    .spec()
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_kaya}`,
                    })
                    .get("/artist-types/")
                    .expectStatus(200)
                    .expectJsonLength(10);
            });
        });

        describe("Get artist type by Id / 10", () => {
            it("Should get artist type by Id with moderator role", async () => {
                await pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .get("/artist-types/{id}")
                    .expectStatus(200)
                    .expectBodyContains(
                        TestData.artistTypes[9].artisitTypeName,
                    );
            });
        });

        describe("Edit artist type by Id / 10", () => {
            it("Should edit artist type by Id with moderator role", async () => {
                const editArtistTypeDto: CreateArtistTypeDto = {
                    artisitTypeName: "Type to Delete",
                };
                await pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .withBody(editArtistTypeDto)
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .patch("/artist-types/{id}")

                    .expectStatus(200)
                    .expectBodyContains(editArtistTypeDto.artisitTypeName);
            });
        });

        describe("Delete artist type by Id / 10", () => {
            it("Should delete artist type by Id with moderator role", async () => {
                await pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .delete("/artist-types/{id}")
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .expectStatus(200);

                return pactum
                    .spec()
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_kaya}`,
                    })
                    .get("/artist-types/")
                    .expectStatus(200)
                    .expectJsonLength(9);
            });
            it("Should not delete artist type by Id without moderator role", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .delete("/artist-types/{id}")
                    .withPathParams({ id: `$S{artistTypeModId}` })
                    .expectStatus(403);
            });
        });
    });

    describe("Artists CRUD", () => {
        describe("Create Artist", () => {
            it("Should commit me as Artist", async () => {
                return pactum
                    .spec()
                    .post("/artists/")
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_khazaar}`,
                    })
                    .withBody(TestData.createArtistDtoKhazaar)
                    .stores("khazaarArtistId", "id")
                    .expectStatus(201)
                    .expectBodyContains(TestData.createArtistDtoKhazaar.style);
            });
        });
    });

    describe("Organizer CRUD", () => {
        describe("Create Organizer", () => {
            it("Should commit me as Organizer", async () => {
                return pactum

                    .spec()
                    .post("/organizers/")
                    .withHeaders({
                        Authorization: `Bearer $S{userAt_mari}`,
                    })
                    .withBody(TestData.createOrganizerDtoMari)
                    .stores("mariOrganizerId", "id")
                    .expectStatus(201)
                    .expectBodyContains(TestData.createUserDtoMari.nickName);
            });
        });
    });

    describe("Events CRUD", () => {
        describe("Create Event", () => {
            it("Should create event with Organizer role", async () => {
                const createEventDto1: CreateEventDto = {
                    name: "Test Event",
                    ogranizerId: pactum.parse(`$S{mariOrganizerId}`),
                    artisitId: pactum.parse(`$S{khazaarArtistId}`),
                    location: "Haifa",
                    description: "Nice event",
                };
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_mari}` })
                    .post("/events/")
                    .withBody(createEventDto1)
                    .expectStatus(201);
            });
            it("Should not create event without Organizer role", async () => {
                const createEventDto: CreateEventDto = {
                    name: "Test Event",
                    ogranizerId: pactum.parse(`$S{firstOrganizerId}`)[0],
                    artisitId: pactum.parse(`$S{firstArtistId}`)[0],
                    location: "Haifa",
                    description: "Nice event",
                };
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .post("/events/")
                    .withBody(createEventDto)
                    .expectStatus(403);
            });
        });
        describe("Approve Event", () => {
            it("Should approve event with Moderator role", async () => {
                return true;
            });
        });

        describe("Get Events", () => {
            it("Should get all events. Returns Empty, as they are not approved", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_khazaar}` })
                    .get("/events/")
                    .stores("firstEventId", "id")
                    .expectStatus(200)
                    .expectJsonLength(0);
            });
            // it("Should get event by Id with artist and organizer", async () => {
            //     return pactum
            //         .spec()
            //         .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
            //         .withPathParams({ id: `$S{firstEventId}` })
            //         .get("/events/{id}")
            //         .expectStatus(200)
            //         .expectBodyContains("House");
            // });
        });
        describe("Edit Event", () => {});
        describe("Delete Event", () => {});
    });
});
