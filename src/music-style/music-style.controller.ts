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
import { MusicStyleDto } from "./music-style.dto";
import { PermissionsGuard } from "../authz/permissions.guard";
import { AuthGuard } from "@nestjs/passport";
import { PermissionTypes } from "../authz/permissions.enum";
import { Permissions } from "../authz/permissions.decorator";

@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller("music-styles")
export class MusicStyleController {
    constructor(private readonly musicStyleService: MusicStyleService) {}

    @Post()
    @Permissions(PermissionTypes.cudMusicStyles)
    public async createMusicStyle(@Body() dto: MusicStyleDto) {
        return await this.musicStyleService.createMusicStyle(dto);
    }

    @Get()
    public async getAllMusicStyles() {
        return await this.musicStyleService.getAllMusicStyles();
    }

    @Get(":id")
    public async getMusicStyleById(@Param("id", ParseIntPipe) id: number) {
        return await this.musicStyleService.getMusicStyleById(id);
    }

    @Patch(":id")
    @Permissions(PermissionTypes.cudMusicStyles)
    public async editMusicStyleById(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: MusicStyleDto,
    ) {
        return await this.musicStyleService.updateMusicStyleById(id, dto);
    }

    @Delete(":id")
    @Permissions(PermissionTypes.cudMusicStyles)
    public async deleteMusicStyleById(@Param("id", ParseIntPipe) id: number) {
        return await this.musicStyleService.deleteMusicStyleById(id);
    }
}
