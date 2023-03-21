import { CreateEventDto, UpdateEventDto } from "./event.dto";
import {
    BadRequestException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AccessPayload } from "../authz/accessPayload.dto";

@Injectable()
export class EventService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}
    public async createEvent(
        accessPayload: AccessPayload,
        dto: CreateEventDto,
    ) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
            });
            console.log(user);
            if (!user) {
                this.logger.error("User not found");
                throw new NotFoundException("User not found");
            }

            const ogranizer = await this.prismaService.organizer.findFirst({
                where: { userId: user.id },
            });
            console.log(ogranizer);
            if (!ogranizer) {
                this.logger.error("Requested for not an organizer");
                throw new InternalServerErrorException(
                    "Requested for not an organizer",
                );
            }
            const artist = await this.prismaService.artist.findFirst({
                where: { id: dto.artisitId },
            });
            if (!artist) {
                this.logger.error("Artist not found");
                throw new NotFoundException("Artist not found");
            }

            const event = await this.prismaService.event.create({
                data: {
                    name: dto.name,
                    ogranizerId: ogranizer.id,
                    artisitId: artist.id,
                    location: dto.location,
                    description: dto.description,
                },
            });

            // await this.prismaService.artist.update({
            //     where: { id: artist.id },
            //     data: {
            //         events: {
            //             connect: {
            //                 id: event.id,
            //             },
            //         },
            //     },
            // });
            // await this.prismaService.organizer.update({
            //     where: { id: ogranizer.id },
            //     data: {
            //         events: {
            //             set: [ogranizer.],
            //         },
            //     },
            // });

            return event;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(error);
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
    public async updateEventById(
        accessPayload: AccessPayload,
        id: number,
        dto: UpdateEventDto,
    ) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
            });
            if (!user) {
                this.logger.error("User not found");
                throw new NotFoundException("User not found");
            }

            const ogranizer = await this.prismaService.organizer.findFirst({
                where: { userId: user.id },
                select: {
                    events: {
                        where: {
                            id: id,
                        },
                    },
                },
            });
            if (!ogranizer) {
                this.logger.error("Requested for not an organizer");
                throw new InternalServerErrorException(
                    "Requested for not an organizer",
                );
            }

            if (ogranizer.events.length === 0) {
                this.logger.error("Event not found");
                throw new NotFoundException("Event not found");
            }

            const event = await this.prismaService.event.update({
                where: { id: id },
                data: {
                    name: dto.name,
                    location: dto.location,
                    description: dto.description,
                },
            });

            return event;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(error);
                throw new InternalServerErrorException(error);
            }
        }
    }

    public async getAllPengingEvents() {
        try {
            const events = await this.prismaService.event.findMany({
                where: {
                    isApproved: false,
                },
                include: {
                    artists: true,
                    ogranizer: true,
                },
            });
            if (events.length === 0) {
                this.logger.error("No pending events");
                throw new NotFoundException("No pending events");
            }
            return events;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    public async approveEventById(id: number) {
        try {
            const event = await this.prismaService.event.findFirst({
                where: { id: id },
            });
            if (!event) {
                this.logger.error("Event not found");
                throw new NotFoundException("Event not found");
            }

            const updatedEvent = await this.prismaService.event.update({
                where: { id: id },
                data: {
                    isApproved: true,
                },
            });
            return updatedEvent;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    public async deletePendingEventById(id: number) {
        try {
            const event = await this.prismaService.event.findFirst({
                where: { id: id },
            });
            if (!event) {
                this.logger.error("Event not found");
                throw new NotFoundException("Event not found");
            }

            if (event.isApproved) {
                this.logger.error("Event already approved");
                throw new InternalServerErrorException(
                    "Event already approved",
                );
            }

            const deletedEvent = await this.prismaService.event.delete({
                where: { id: id },
            });
            return deletedEvent;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
}
