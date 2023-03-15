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

describe("App e2e test", () => {
    let app: INestApplication;
    let prisma: PrismaService;
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
        const dto: AuthDto = {
            email: "eeguar@gmail.com",
            password: "asdfasdfasdg345",
        };
        describe("SignUp", () => {
            it("Empty email exeption", async () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody({
                        ...dto,
                        email: "",
                    })
                    .expectStatus(400);
            });
            it("Should sign up", async () => {
                return pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(dto)
                    .expectStatus(201);
            });
        });
        describe("SignIn", () => {
            it("Should sign in", async () => {
                return pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(dto)
                    .expectStatus(200)
                    .stores("userAt_eeguar", "access_token");
            });
        });
    });
    describe("Users CRUD", () => {
        describe("Create user", () => {
            it("Should create user with Artist role", async () => {
                const createUserDto: CreateUserDto = {
                    nickName: "Khazaar",
                    roles: [Role.Artist],
                };
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withBody(createUserDto)
                    .expectStatus(201)
                    .expectBodyContains("Khazaar");
            });
            it("Should create user with Organizer role", async () => {
                //Sign up another user
                const dto: AuthDto = {
                    email: "mari@gmail.com",
                    password: "2456tregfdsyu",
                };
                await pactum
                    .spec()
                    .post("/auth/signup")
                    .withBody(dto)
                    .expectStatus(201);

                //Sign up new user
                await pactum
                    .spec()
                    .post("/auth/signin")
                    .withBody(dto)
                    .expectStatus(200)
                    .stores("userAt_mari", "access_token");

                const createUserDto: CreateUserDto = {
                    nickName: "Mari",
                    roles: [Role.Organizer],
                };
                return pactum
                    .spec()
                    .post("/users/")
                    .withHeaders({ Authorization: `Bearer $S{userAt_mari}` })
                    .withBody(createUserDto)
                    .expectStatus(201)
                    .expectBodyContains("Mari");
            });
        });

        describe("Get Me", () => {
            it("Should get current user", async () => {
                return pactum
                    .spec()
                    .get("/users/me")
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .expectStatus(200);
            });
        });

        describe("Get all users", () => {
            it("Should get all users", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .get("/users/")
                    .stores("firstUserId", "[0].id")
                    .expectStatus(200)
                    .expectBodyContains("eeguar@gmail.com")
                    .expectJsonLength(2);
            });
        });

        describe("Get user by Id", () => {
            it("Should get user by Id", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withPathParams({ id: `$S{firstUserId}` })
                    .get("/users/{id}")
                    .expectStatus(200)
                    .expectBodyContains("eeguar@gmail.com");
            });
        });

        describe("Edit by Id", () => {
            it("Should edit user by Id", async () => {
                const editUserDto: EditUserDto = {
                    nickName: "Khazaaarr",
                };
                await pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withPathParams({ id: `$S{firstUserId}` })
                    .withBody(editUserDto)
                    .patch("/users/{id}")
                    .expectStatus(200);

                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withPathParams({ id: `$S{firstUserId}` })
                    .get("/users/{id}")
                    .expectStatus(200)
                    .expectBodyContains("Khazaaarr");
            });
        });
    });
    describe("Artists CRUD", () => {
        describe("Create Artist", () => {
            it("Should create artist", async () => {
                const createArtistDto: CreateArtistDto = {
                    userId: 1,
                    style: "House",
                };

                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .post("/artists/")
                    .withBody(createArtistDto)
                    .expectStatus(201)
                    .expectBodyContains("House");
            });
        });
        describe("Get Artist", () => {
            it("Should get all artists with user data", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .get("/artists/")
                    .stores("firstArtistId", "id")
                    .expectStatus(200)
                    .expectBodyContains("House");
            });
            it("Should get artist by Id", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withPathParams({ id: `$S{firstArtistId}` })
                    .get("/artists/{id}")
                    .expectStatus(200)
                    .expectBodyContains("House");
            });
        });
        describe("Edit Artist", () => {});
        describe("Delete Artist", () => {});
    });
    describe("Organizers CRUD", () => {
        describe("Create Organizer", () => {
            const createOrganizerDto: CreateOrganizerDto = {
                userId: 1,
                mainLocation: "Haifa",
            };
            it("Should create organizer", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .post("/organizers/")
                    .withBody(createOrganizerDto)
                    .expectStatus(201);
            });
        });
        describe("Get Organizer", () => {
            it("Should get all organizers with user data", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .get("/organizers/")
                    .stores("firstOrganizerId", "id")
                    .expectStatus(200);
            });
            it("Should get organizer by Id", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withPathParams({ id: `$S{firstOrganizerId}` })
                    .get("/organizers/")
                    .expectStatus(200);
            });
        });
        describe("Edit Organizer", () => {});
        describe("Delete Organizer", () => {});
    });

    describe("Events CRUD", () => {
        describe("Create Event", () => {
            it("Should create event with Organizer role", async () => {
                const createEventDto: CreateEventDto = {
                    name: "Test Event",
                    ogranizerId: pactum.parse(`$S{firstOrganizerId}`)[0],
                    artisitId: pactum.parse(`$S{firstArtistId}`)[0],
                    location: "Haifa",
                    description: "Nice event",
                };
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_mari}` })
                    .post("/events/")
                    .withBody(createEventDto)
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
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .post("/events/")
                    .withBody(createEventDto)
                    .expectStatus(403);
            });
        });
        describe("Get Event", () => {
            it("Should get all events", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .get("/events/")
                    .stores("firstEventId", "id")
                    .expectStatus(200);
            });
            it("Should get event by Id with artist and organizer", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt_eeguar}` })
                    .withPathParams({ id: `$S{firstEventId}` })
                    .get("/events/{id}")
                    .expectStatus(200)
                    .expectBodyContains("House");
            });
        });
        describe("Edit Event", () => {});
        describe("Delete Event", () => {});
    });
});
