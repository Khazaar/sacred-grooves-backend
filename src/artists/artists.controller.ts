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
} from "@nestjs/common";
import { CreateArtistDto } from "./artist.dto";
import { User } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard("jwt"))
@Controller("artists")
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}

    @Post()
    public async createArtist(
        @Body() dto: CreateArtistDto,
        @GetUser() user: User,
    ) {
        return await this.artistsService.createArtist(user.id, dto);
    }
    @Get()
    public async getAllArtists() {
        return await this.artistsService.getAllArtists();
    }
    @Get(":id")
    public async getArtistById(@Param("id", ParseIntPipe) id: number) {
        return await this.artistsService.getArtistById(id);
    }
}
