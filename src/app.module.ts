import { AuthModule } from "./auth/auth.module";
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

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ArtistsModule,
        AuthModule,
        PrismaModule,
        UserModule,
    ],
    controllers: [UserController, OrganizerController, EventController],
    providers: [UserService, OrganizerService, EventService],
})
export class AppModule {}
