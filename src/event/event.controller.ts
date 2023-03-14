import { EventService } from "./event.service";
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { CreateEventDto } from "./event.dto";

@UseGuards(JwtGuard)
@Controller("events")
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Post()
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
}
