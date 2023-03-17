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
import { CreateArtistTypeDto } from "./artist-type.dto";
import { ArtistTypeService } from "./artist-type.service";

@UseGuards(JwtGuard, RolesGuard)
@Controller("artist-types")
export class ArtistTypeController {
    constructor(private readonly artistTypeService: ArtistTypeService) {}

    @Post()
    @Roles(Role.Moderator)
    public async createArtistType(@Body() dto: CreateArtistTypeDto) {
        return await this.artistTypeService.createArtistType(dto);
    }

    @Get()
    @Roles(Role.Moderator)
    public async getAllArtistTypes() {
        return await this.artistTypeService.getAllArtistTypes();
    }

    @Get(":id")
    @Roles(Role.Moderator)
    public async getArtistTypeById(@Param("id", ParseIntPipe) id: number) {
        return await this.artistTypeService.getArtistTypeById(id);
    }

    @Patch(":id")
    @Roles(Role.Moderator)
    public async editArtistTypeById(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: CreateArtistTypeDto,
    ) {
        return await this.artistTypeService.updateArtistTypeById(id, dto);
    }

    @Delete(":id")
    @Roles(Role.Moderator)
    public async deleteArtistTypeById(@Param("id", ParseIntPipe) id: number) {
        return await this.artistTypeService.deleteArtistTypeById(id);
    }
}
