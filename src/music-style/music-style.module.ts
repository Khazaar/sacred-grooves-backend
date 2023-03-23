import { Module } from "@nestjs/common";
import { MusicStyleService } from "./music-style.service";
import { MusicStyleController } from "./music-style.controller";

@Module({
    providers: [MusicStyleService],
    controllers: [MusicStyleController],
})
export class MusicStyleModule {}
