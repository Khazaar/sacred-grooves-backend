import { AuthDto } from "../src/auth/auth.dto";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { EditUserDto } from "src/user/dto";
import { CreateArtistDto } from "src/artists/artist.dto";
import { CreateOrganizerDto } from "src/organizer/organizer.dto";
import { CreateEventDto } from "src/event/event.dto";

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
            email: "eeguar333@gmail.com",
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
                    .stores("userAt", "access_token");
            });
        });
    });
    describe("Users CRUD", () => {
        describe("Get Me", () => {
            it("Should get current user", async () => {
                return pactum
                    .spec()
                    .get("/users/me")
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .expectStatus(200);
            });
        });

        describe("Get all users", () => {
            it("Should get all users", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .get("/users/")
                    .stores("firstUserId", "id")
                    .expectStatus(200)
                    .expectBodyContains("eeguar333@gmail.com");
            });
        });

        describe("Get user by Id", () => {
            it("Should get user by Id", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .withPathParams({ id: `$S{firstUserId}` })
                    .get("/users/{id}")
                    .expectStatus(200)
                    .expectBodyContains("eeguar333@gmail.com");
            });
        });

        describe("Edit by Id", () => {
            it("Should edit user by Id", async () => {
                const editUserDto: EditUserDto = {
                    nickName: "Khazaaarr",
                };
                await pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .withPathParams({ id: `$S{firstUserId}` })
                    .withBody(editUserDto)
                    .patch("/users/{id}")
                    .expectStatus(200);

                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
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
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
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
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .get("/artists/")
                    .stores("firstArtistId", "id")
                    .expectStatus(200)
                    .expectBodyContains("House");
            });
            it("Should get artist by Id", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
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
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .post("/organizers/")
                    .withBody(createOrganizerDto)
                    .expectStatus(201);
            });
        });
        describe("Get Organizer", () => {
            it("Should get all organizers with user data", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .get("/organizers/")
                    .stores("firstOrganizerId", "id")
                    .expectStatus(200);
            });
            it("Should get organizer by Id", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
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
            it("Should create event", async () => {
                const createEventDto: CreateEventDto = {
                    name: "Test Event",
                    ogranizerId: pactum.parse(`$S{firstOrganizerId}`)[0],
                    artisitId: pactum.parse(`$S{firstArtistId}`)[0],
                    location: "Haifa",
                    description: "Nice event",
                };
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .post("/events/")
                    .withBody(createEventDto)
                    .expectStatus(201);
            });
        });
        describe("Get Event", () => {
            it("Should get all events", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
                    .get("/events/")
                    .stores("firstEventId", "id")
                    .expectStatus(200);
            });
            it("Should get event by Id with artist and organizer", async () => {
                return pactum
                    .spec()
                    .withHeaders({ Authorization: `Bearer $S{userAt}` })
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
