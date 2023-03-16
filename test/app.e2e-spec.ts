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

describe("App e2e test", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    // Artist
    const authDtoKhazaar: AuthDto = {
        email: "khazaar@gmail.com",
        password: "asdfasdfasdg345",
    };
    const createUserDtoKhazaar: CreateUserDto = {
        nickName: "Khazaar",
    };
    const createArtistDtoKhazaar: CreateArtistDto = {
        style: "House",
    };
    // Organizer
    const authDtoMari: AuthDto = {
        email: "mari@gmail.com",
        password: "sdfasdasyeer",
    };
    const createUserDtoMari: CreateUserDto = {
        nickName: "Marii",
    };
    const createOrganizerDtoMari: CreateOrganizerDto = {
        mainLocation: "Siberia",
    };
    // Moderator
    const authDtoKaya: AuthDto = {
        email: "kaya@gmail.com",
        password: "sdfasdasyeer",
    };
    const createUserDtoKaya: CreateUserDto = {
        nickName: "Kaya the bird",
    };
    // Student
    const authDtoPeter: AuthDto = {
        email: "peter@gmail.com",
        password: "56453yrte434u5786yrt",
    };
    const createUserDtoPeter: CreateUserDto = {
        nickName: "Peter Power",
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        await app.listen(3333);
        prisma = app.get(PrismaService);
        prisma.cleadDb();
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
                        ...authDtoKhazaar,
                        email: "",
                    })
                    .expectStatus(400);
            });
            it("Should sign up / create accounts: khazaar, mari, kaya, peter", async () => {
                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(authDtoKhazaar)
                    .expectStatus(201)
                    .stores("khazaarUserId", "id");

                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(authDtoMari)
                    .stores("mariUserId", "id")
                    .expectStatus(201);

                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(authDtoKaya)
                    .stores("kayaUserId", "[3].id")
                    .expectStatus(201);
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(authDtoPeter)
                    .stores("peterUserId", "id")
                    .expectStatus(201);
            });
        });
        describe("SignIn / get auth token", () => {
            it("Should sign in and get tokens for khazaar, mari, kaya, peter", async () => {
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(authDtoKhazaar)
                    .expectStatus(200)
                    .stores("userAt_khazaar", "access_token");
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(authDtoMari)
                    .expectStatus(200)
                    .stores("userAt_mari", "access_token");
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(authDtoKaya)
                    .expectStatus(200)
                    .stores("userAt_kaya", "access_token");
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(authDtoPeter)
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
                    .withBody(createUserDtoKhazaar)
                    .expectStatus(201)
                    .expectBodyContains(createUserDtoKhazaar.nickName);
            });
            it("Should create user mari", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_mari}` })
                    .withBody(createUserDtoMari)
                    .expectStatus(201)
                    .expectBodyContains(createUserDtoMari.nickName);
            });
            it("Should create user peter", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_peter}` })
                    .withBody(createUserDtoPeter)
                    .expectStatus(201)
                    .expectBodyContains(createUserDtoPeter.nickName);
            });
            it("Should create user kaya", async () => {
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_kaya}` })
                    .withBody(createUserDtoKaya)
                    .expectStatus(201)
                    .expectBodyContains(createUserDtoKaya.nickName);
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
                    userEmail: authDtoKaya.email,
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
                    .expectBodyContains(authDtoKhazaar.email)
                    .expectBodyContains(authDtoMari.email)
                    .expectBodyContains(authDtoKaya.email)
                    .expectBodyContains(authDtoPeter.email)
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
                    .expectBodyContains(createUserDtoKhazaar.nickName);
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
                    .withBody(createArtistDtoKhazaar)
                    .stores("khazaarArtistId", "id")
                    .expectStatus(201)
                    .expectBodyContains(createArtistDtoKhazaar.style);
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
                    .withBody(createOrganizerDtoMari)
                    .stores("mariOrganizerId", "id")
                    .expectStatus(201)
                    .expectBodyContains(createUserDtoMari.nickName);
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
