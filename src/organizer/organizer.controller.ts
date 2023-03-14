import { CreateOrganizerDto } from "./organizer.dto";
import { OrganizerService } from "./organizer.service";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { JwtGuard } from "../auth/guard";

@UseGuards(JwtGuard)
@Controller("organizers")
export class OrganizerController {
    constructor(private readonly artistsService: OrganizerService) {}

    @Post()
    public async createOrganizer(
        @Body() dto: CreateOrganizerDto,
        @GetUser() user: User,
    ) {
        return await this.artistsService.createOrganizer(user.id, dto);
    }
    @Get()
    public async getAllOrganizers() {
        return await this.artistsService.getAllOrganizers();
    }
}
