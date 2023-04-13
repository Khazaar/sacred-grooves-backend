import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, EditUserDto } from "./user.dto";
import * as argon from "argon2";
import { AccessPayload } from "../authz/accessPayload.dto";
import { Prisma } from "@prisma/client";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly prismaService: PrismaService,
    ) {}

    public async createUser(
        dto: CreateUserDto,
        accessPayload: AccessPayload,
        avatarUrl: any,
    ) {
        const mapLocation = await this.prismaService.mapLocation.create({
            data: {},
        });

        if (dto.mapLocation) {
            await this.prismaService.mapLocation.update({
                where: { id: mapLocation.id },
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
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                nickName: dto.nickName,
                auth0sub: accessPayload.sub,
                firstName: dto.firstName,
                lastName: dto.lastName,
                avatar: {
                    create: {
                        pictureS3Url: avatarUrl,
                        title: `Avatar for ${dto.nickName}`,
                    },
                },
                mapLocation: {
                    connect: { id: mapLocation.id },
                },
            },
            include: {
                avatar: true,
                mapLocation: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public async getAllUsers() {
        const users = await this.prismaService.user.findMany();
        return users;
    }

    public async getUserByEmail(email: string) {
        const user = await this.prismaService.user.findFirst({
            where: { email: email },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public async editUser(
        accessPayload: AccessPayload,
        dto: EditUserDto,
        avatarUrl: string,
    ) {
        let user = await this.prismaService.user.findFirst({
            where: { auth0sub: accessPayload.sub },
        });
        if (!user) {
            throw new NotFoundException("User not found");
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

        user = await this.prismaService.user.update({
            where: { auth0sub: accessPayload.sub },
            data: {
                email: dto.email,
                nickName: dto.nickName,
                auth0sub: accessPayload.sub,
                avatar: {
                    create: {
                        pictureS3Url: avatarUrl,
                        title: `Avatar for ${dto.nickName}`,
                    },
                },
                mapLocation: {
                    connect: { id: mapLocation.id },
                },
                firstName: dto.firstName,
                lastName: dto.lastName,
                telegramName: dto.telegramName,
            },
            include: {
                avatar: true,
                mapLocation: true,
            },
        });
        return user;
    }

    public async getMe(accessPayload: AccessPayload) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
                include: {
                    avatar: true,
                    mapLocation: true,
                    artist: {
                        select: {
                            artistTypes: true,
                            musicStyles: true,
                        },
                    },
                    organizer: true,
                    supportTeam: true,
                    visitor: true,
                },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(error);
                throw new InternalServerErrorException(error);
            }
        }
    }
}
