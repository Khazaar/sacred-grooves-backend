import { AuthModule } from "./auth/auth.module";
import { ArtistsModule } from "./artists/artists.module";
import { MiddlewareConsumer, Module, Options } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { UserModule } from "./user/user.module";
import { OrganizerController } from "./organizer/organizer.controller";
import { OrganizerService } from "./organizer/organizer.service";
import { EventController } from "./event/event.controller";
import { EventService } from "./event/event.service";
import { ModeratorService } from "./moderator/moderator.service";
import { ModeratorController } from "./moderator/moderator.controller";
import { ModeratorModule } from "./moderator/moderator.module";
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
import { AuthzModule } from './authz/authz.module';
import * as winston from "winston";

const fileFormat = winston.format.printf(
    ({ level, message, timestamp, context }) => {
        return `${timestamp} ${level}: ${message}  [${context}]`;
    },
);

const formatMeta = (meta) => {
    // You can format the splat yourself
    const splat = meta[Symbol.for("splat")];
    if (splat && splat.length) {
        return splat.length === 1
            ? JSON.stringify(splat[0])
            : JSON.stringify(splat);
    }
    return "";
};
const customFormat = winston.format.printf(
    ({ timestamp, level, message, label = "", ...meta }) =>
        `[${timestamp}] ${level}\t ${label} ${message} ${formatMeta(meta)}`,
);

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ArtistsModule,
        AuthModule,
        PrismaModule,
        UserModule,
        ModeratorModule,
        ArtistTypeModule,
        MusicStyleModule,
        WinstonModule.forRoot({
            silent: true, // Enable logger here
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
    ],
    controllers: [
        UserController,
        OrganizerController,
        EventController,
        ModeratorController,
        ArtistTypeController,
    ],
    providers: [
        UserService,
        OrganizerService,
        EventService,
        ModeratorService,
        ArtistTypeService,
        {
            provide: APP_INTERCEPTOR,
            useClass: HTTPInterceptor,
        },
    ],
})
export class AppModule {}
