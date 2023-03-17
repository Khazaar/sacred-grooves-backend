import { MusicStyleService } from "./music-style.service";

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { Roles } from "../auth/decorator";
import { Role } from "../auth/enums/roles.enum";
import { JwtGuard } from "../auth/guard";
import { RolesGuard } from "../auth/guard/roles.guard";
import { MusicStyleDto } from "./music-style.dto";

@UseGuards(JwtGuard, RolesGuard)
@Controller("music-styles")
export class MusicStyleController {
    constructor(private readonly musicStyleService: MusicStyleService) {}
    @Post()
    @Roles(Role.Moderator)
    public async createMusicStyle(@Body() dto: MusicStyleDto) {
        return await this.musicStyleService.createMusicStyle(dto);
    }

    @Get()
    @Roles(Role.Moderator)
    public async getAllMusicStyles() {
        return await this.musicStyleService.getAllMusicStyles();
    }

    @Get(":id")
    @Roles(Role.Moderator)
    public async getMusicStyleById(@Param("id", ParseIntPipe) id: number) {
        return await this.musicStyleService.getMusicStyleById(id);
    }

    @Patch(":id")
    @Roles(Role.Moderator)
    public async editMusicStyleById(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: MusicStyleDto,
    ) {
        return await this.musicStyleService.updateMusicStyleById(id, dto);
    }

    @Delete(":id")
    @Roles(Role.Moderator)
    public async deleteMusicStyleById(@Param("id", ParseIntPipe) id: number) {
        return await this.musicStyleService.deleteMusicStyleById(id);
    }
}
