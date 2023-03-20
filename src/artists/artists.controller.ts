import { GetUser } from "./../auth/decorator/getUserDecorator";
import { ArtistsService } from "./artists.service";
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ParseIntPipe,
    Put,
    Delete,
} from "@nestjs/common";
import { CreateArtistDto, UpdateArtistDto } from "./artist.dto";
import { User } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";
import { PermissionsGuard } from "../authz/permissions.guard";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { AccessPayload } from "../authz/accessPayload.dto";

@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller("artists")
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}

    @Post()
    public async createArtist(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Body() dto: CreateArtistDto,
    ) {
        return await this.artistsService.createArtist(accessPayload, dto);
    }
    @Get()
    public async getAllArtists() {
        return await this.artistsService.getAllArtists();
    }
    @Put("me")
    public async updateMe(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Body() dto: UpdateArtistDto,
    ) {
        return await this.artistsService.updateArtistMe(accessPayload, dto);
    }
    @Delete("me")
    public async deleteMe(@GetAccessPayload() accessPayload: AccessPayload) {
        return await this.artistsService.deleteArtistMe(accessPayload);
    }
    @Get(":id")
    public async getArtistById(@Param("id", ParseIntPipe) id: number) {
        return await this.artistsService.getArtistById(id);
    }
}
