import { CreateEventDto } from "./event.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EventService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createEvent(dto: CreateEventDto) {
        const event = await this.prismaService.event.create({
            data: {
                name: dto.name,
                ogranizerId: dto.ogranizerId,
                artisitId: dto.artisitId,
                location: dto.location,
                description: dto.description,
            },
        });
        return event;
    }
    public async getAllevents() {
        const event = await this.prismaService.event.findMany({
            include: {
                artists: true,
                ogranizer: true,
            },
        });
        return event;
    }
    public async getEventById(eventId: number) {
        const event = await this.prismaService.event.findFirst({
            where: { id: eventId },
            include: {
                artists: true,
                ogranizer: true,
            },
        });
        if (!event) {
            throw new NotFoundException("Event not found");
        }
        return event;
    }
}
