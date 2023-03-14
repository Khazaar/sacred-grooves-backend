import { ArtistsService } from "./artists.service";
import { ArtistsController } from "./artists.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [ArtistsController],
    providers: [ArtistsService],
})
export class ArtistsModule {}
