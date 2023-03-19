import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { EditUserDto } from "../src/user/user.dto";
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
        pactum.request.setBaseUrl("");
    });
    afterAll(async () => {
        await app.close();
        await prismaService.$disconnect();
    });
    beforeEach(() => {});
    describe("Auth", () => {
        describe("SignIn / get auth token", () => {
            const users = [
                //TestData.createUserDtoKhazaar,
                //TestData.createUserDtoMari,
                TestData.createUserDtoKaya,
                //TestData.createUserDtoPeter,
            ];
            it("Should get tokens from Auth0", async () => {
                for (const usr of users) {
                    usr.tokenKey =
                        "userAt_" + usr.email.replace("@gmail.com", "");
                    await pactum
                        .spec()
                        .post(`${process.env.AUTH0_ISSUER_URL}oauth/token`)
                        .withBody({
                            grant_type: "password",
                            username: usr.email,
                            password: usr.password,
                            audience: process.env.AUTH0_AUDIENCE,
                            scope: "profile permissions",
                            client_id: process.env.AUTH0_CLIENT_ID,
                            client_secret: process.env.AUTH0_CLIENT_SECRET,
                        })
                        .expectStatus(200)
                        .stores(usr.tokenKey, "access_token");
                    console.log(pactum.parse("$S{" + usr.tokenKey + "}"));
                }
            });
            it("Should create user in DB", async () => {
                for (const usr of users) {
                    const store_name = "userAt" + +usr.email;
                    const auth = `Bearer $S{userAt_kaya@gmail.com}`;
                    await pactum
                        .spec()
                        .post(localURL + "users")
                        .withBody(usr)
                        .withHeaders({
                            Authorization: "Bearer $S{" + usr.tokenKey + "}",
                        })
                        .expectStatus(201);
                }
            });
        });
    });
});
