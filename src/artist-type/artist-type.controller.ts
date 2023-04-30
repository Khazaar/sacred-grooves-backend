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
import { AuthGuard } from "@nestjs/passport";
import { PermissionsGuard } from "../authz/permissions.guard";
import { Permissions } from "../authz/permissions.decorator";
import { ArtistTypeDto } from "./artist-type.dto";
import { ArtistTypeService } from "./artist-type.service";
import { PermissionTypes } from "../authz/permissions.enum";

@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller("artist-types")
export class ArtistTypeController {
    constructor(private readonly artistTypeService: ArtistTypeService) {}

    @Post()
    @Permissions(PermissionTypes.cudArtistTypes)
    public async createArtistType(@Body() dto: ArtistTypeDto) {
        return await this.artistTypeService.createArtistType(dto);
    }

    @Get()
    public async getAllArtistTypes() {
        return await this.artistTypeService.getAllArtistTypes();
    }

    @Get(":id")
    public async getArtistTypeById(@Param("id", ParseIntPipe) id: number) {
        return await this.artistTypeService.getArtistTypeById(id);
    }

    @Patch(":id")
    @Permissions(PermissionTypes.cudArtistTypes)
    public async editArtistTypeById(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: ArtistTypeDto,
    ) {
        return await this.artistTypeService.updateArtistTypeById(id, dto);
    }

    @Delete(":id")
    @Permissions(PermissionTypes.cudArtistTypes)
    public async deleteArtistTypeById(@Param("id", ParseIntPipe) id: number) {
        return await this.artistTypeService.deleteArtistTypeById(id);
    }
}
