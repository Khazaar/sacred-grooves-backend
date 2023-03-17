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
import { ModeratorService } from './moderator/moderator.service';
import { ModeratorController } from './moderator/moderator.controller';
import { ModeratorModule } from './moderator/moderator.module';
import { ArtistTypeController } from './artist-type/artist-type.controller';
import { ArtistTypeService } from './artist-type/artist-type.service';
import { ArtistTypeModule } from './artist-type/artist-type.module';
import { MusicStyleModule } from './music-style/music-style.module';

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
    ],
    controllers: [UserController, OrganizerController, EventController, ModeratorController, ArtistTypeController],
    providers: [UserService, OrganizerService, EventService, ModeratorService, ArtistTypeService],
})
export class AppModule {}
