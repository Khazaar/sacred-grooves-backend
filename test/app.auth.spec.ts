import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { CreateUserDto, EditUserDto } from "../src/user/user.dto";
import { CreateEventDto } from "src/event/event.dto";
import { GrantModeratorDto } from "src/moderator/moderator.dto";
import { TestData } from "./testData";
import * as dotenv from "dotenv";

import { CreateArtistTypeDto } from "src/artist-type/artist-type.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";

describe("App auth", () => {
    dotenv.config();
    let app: INestApplication;
    let prismaService: PrismaService;
    const localURL = "http://localhost:3333/";

    const users = [
        TestData.createUserDtoKhazaar,
        //TestData.createUserDtoMari,
        TestData.createUserDtoKaya,
        //TestData.createUserDtoPeter,
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
                    .inspect()
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
    });
});
