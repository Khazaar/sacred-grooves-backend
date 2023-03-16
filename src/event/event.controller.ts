import { EventService } from "./event.service";
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    SetMetadata,
    UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { CreateEventDto } from "./event.dto";
import { Roles } from "../auth/decorator/roles.decorator";
import { Role } from "../auth/enums/roles.enum";
import { RolesGuard } from "../auth/guard/roles.guard";

@UseGuards(JwtGuard, RolesGuard)
@Controller("events")
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    @Roles(Role.NetworkAdmin, Role.Organizer)
    public async createEvent(@Body() dto: CreateEventDto) {
        return await this.eventService.createEvent(dto);
    }
    @Get()
    public async getAllEvents() {
        return await this.eventService.getAllevents();
    }
    @Get(":id")
    public async getEventById(@Param("id", ParseIntPipe) id: number) {
        return await this.eventService.getEventById(id);
    }
    @Patch(":id")
    @Roles(Role.Moderator)
    public async approveEventById(@Param("id", ParseIntPipe) id: number) {
        return await this.eventService.approveEventById(id);
    }
}
