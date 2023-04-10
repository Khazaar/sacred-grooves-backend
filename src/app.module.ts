import { ArtistsModule } from "./artists/artists.module";
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { UserModule } from "./user/user.module";
import { OrganizerController } from "./organizer/organizer.controller";
import { OrganizerService } from "./organizer/organizer.service";
import { EventController } from "./event/event.controller";
import { EventService } from "./event/event.service";
import { ArtistTypeController } from "./artist-type/artist-type.controller";
import { ArtistTypeService } from "./artist-type/artist-type.service";
import { ArtistTypeModule } from "./artist-type/artist-type.module";
import { MusicStyleModule } from "./music-style/music-style.module";
import { HTTPInterceptor } from "./middleware/HTTPInterceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import {
    WinstonModule,
    utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import { AuthzModule } from "./authz/authz.module";
import { CloudAwsService } from "./cloud-aws/cloud-aws.service";
import { CloudAwsModule } from "./cloud-aws/cloud-aws.module";
import { DevtestController } from "./devtest/devtest.controller";
import { DevtestModule } from "./devtest/devtest.module";
import * as winston from "winston";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ArtistsModule,
        PrismaModule,
        UserModule,
        ArtistTypeModule,
        MusicStyleModule,
        WinstonModule.forRoot({
            silent: false, // Enable logger here
            level: "info",
            format: winston.format.errors({ stack: true }),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike("Log", {
                            colors: true,
                            prettyPrint: true,
                        }),
                    ),
                }),
                new winston.transports.File({
                    filename: "SGServer.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike("Log", {
                            prettyPrint: false,
                            colors: false,
                        }),
                    ),
                }),
            ],
        }),
        AuthzModule,
        CloudAwsModule,
        DevtestModule,

        MulterModule.register({
            dest: "./uploads",
        }),
    ],
    controllers: [
        UserController,
        OrganizerController,
        EventController,
        ArtistTypeController,
        DevtestController,
    ],
    providers: [
        UserService,
        OrganizerService,
        EventService,
        ArtistTypeService,
        {
            provide: APP_INTERCEPTOR,
            useClass: HTTPInterceptor,
        },
        CloudAwsService,
    ],
})
export class AppModule {}
