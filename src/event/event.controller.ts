import { EventService } from "./event.service";
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
import { JwtGuard } from "../auth/guard";
import { CreateEventDto, UpdateEventDto } from "./event.dto";
import { RolesGuard } from "../auth/guard/roles.guard";
import { AccessPayload } from "../authz/accessPayload.dto";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { PermissionTypes } from "../authz/permissions.enum";
import { Permissions } from "../authz/permissions.decorator";
import { PermissionsGuard } from "../authz/permissions.guard";

@UseGuards(JwtGuard, PermissionsGuard)
@Controller("events")
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
    public async createEvent(
        @Body() dto: CreateEventDto,
        @GetAccessPayload() accessPayload: AccessPayload,
    ) {
        return await this.eventService.createEvent(accessPayload, dto);
    }
    @Get()
    public async getAllEvents() {
        return await this.eventService.getAllevents();
    }
    @Get("pending")
    @Permissions(PermissionTypes.rudEvents)
    public async getAllPengingEvents() {
        return await this.eventService.getAllPengingEvents();
    }
    // @Get(":id")
    // public async getEventById(@Param("id", ParseIntPipe) id: number) {
    //     return await this.eventService.getEventById(id);
    // }
    @Patch(":id")
    public async updateEventById(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateEventDto,
    ) {
        return await this.eventService.updateEventById(accessPayload, id, dto);
    }

    @Permissions(PermissionTypes.rudEvents)
    @Patch("/pending/:id")
    public async approvePendingEventById(
        @Param("id", ParseIntPipe) id: number,
    ) {
        return await this.eventService.approveEventById(id);
    }

    @Permissions(PermissionTypes.rudEvents)
    @Delete("/pending/:id")
    public async deletePendingEventById(@Param("id", ParseIntPipe) id: number) {
        return await this.eventService.deletePendingEventById(id);
    }
}
