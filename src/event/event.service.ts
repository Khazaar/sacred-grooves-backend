import { CreateEventDto } from "./event.dto";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class EventService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createEvent(dto: CreateEventDto) {
        try {
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.log(error.code);
                console.log(error.message);
                throw new InternalServerErrorException(error.code);
            }
        }
    }
    public async getAllevents() {
        const event = await this.prismaService.event.findMany({
            where: {
                isApproved: true,
            },
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
    public async approveEventById(eventId: number) {
        const event = await this.prismaService.event.update({
            where: { id: eventId },
            data: {
                isApproved: true,
            },
        });
        if (!event) {
            throw new NotFoundException("Event not found");
        }
        return event;
    }
}
