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
        posterUrl: string,
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
            });

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
            // const poster1 = await this.prismaService.picture.create({
            //     data: {
            //         pictureS3Url: posterUrl,
            //         title: `Poster for ${dto.name}`,
            //     },
            // });

            let mapLocation = await this.prismaService.mapLocation.create({
                data: {},
            });

            if (dto.mapLocation) {
                mapLocation = await this.prismaService.mapLocation.create({
                    data: {
                        name: dto.mapLocation.name,
                        address: dto.mapLocation.address,
                        city: dto.mapLocation.city,
                        country: dto.mapLocation.country,
                        latitude: dto.mapLocation.latitude,
                        longitude: dto.mapLocation.longitude,
                    },
                });
            }

            const event = await this.prismaService.event.create({
                data: {
                    name: dto.name,
                    ogranizer: {
                        connect: {
                            id: ogranizer.id,
                        },
                    },
                    artists: {
                        connect: {
                            id: artist.id,
                        },
                    },
                    mapLocation: {
                        connect: {
                            id: mapLocation.id,
                        },
                    },
                    description: dto.description,
                    poster: {
                        create: {
                            pictureS3Url: posterUrl,
                            title: `Poster for ${dto.name}`,
                        },
                    },
                },
                include: {
                    artists: true,
                    ogranizer: true,
                    mapLocation: true,
                    poster: true,
                },
            });

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
                mapLocation: true,
                poster: true,
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
        posterUrl: string,
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

            let mapLocation = await this.prismaService.mapLocation.create({
                data: {},
            });

            if (dto.mapLocation) {
                mapLocation = await this.prismaService.mapLocation.create({
                    data: {
                        name: dto.mapLocation.name,
                        address: dto.mapLocation.address,
                        city: dto.mapLocation.city,
                        country: dto.mapLocation.country,
                        latitude: dto.mapLocation.latitude,
                        longitude: dto.mapLocation.longitude,
                    },
                });
            }

            const event = await this.prismaService.event.update({
                where: { id: id },
                data: {
                    name: dto.name,
                    mapLocation: {
                        connect: {
                            id: mapLocation.id,
                        },
                    },
                    description: dto.description,
                    poster: {
                        create: {
                            pictureS3Url: posterUrl,
                            title: `Poster for ${dto.name}`,
                        },
                    },
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
