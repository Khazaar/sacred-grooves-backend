import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserDto } from "./user.dto";
import { AccessPayload } from "../authz/accessPayload.dto";
import { Prisma } from "@prisma/client";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { use } from "passport";

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly prismaService: PrismaService,
    ) {}

    public async createUser(dto: UserDto, accessPayload: AccessPayload) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
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
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    mapLocation: {
                        connect: { id: mapLocation.id },
                    },
                    profile: {
                        connect: { id: profile.id },
                    },
                },
                include: {
                    avatar: true,
                    mapLocation: true,
                },
            });

            return user;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
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

        dto?: UserDto,
    ) {
        const profile = await this.prismaService.profile.findUnique({
            where: { auth0sub: accessPayload.sub },
        });
        let user = await this.prismaService.user.findFirst({
            where: { profileId: profile.id },
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
            where: { id: user.id },
            data: {
                nickName: dto.nickName,
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

    public async updateAvaratUrl(
        accessPayload: AccessPayload,
        avatarUrl: string,
    ) {
        const profile = await this.prismaService.profile.findUnique({
            where: { auth0sub: accessPayload.sub },
        });
        let user = await this.prismaService.user.findFirst({
            where: { profileId: profile.id },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        user = await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                avatar: {
                    create: {
                        pictureS3Url: avatarUrl,
                        title: `Avatar for ${accessPayload.sub}`,
                    },
                },
            },
            include: {
                avatar: true,
            },
        });
        return user;
    }

    public async getMe(accessPayload: AccessPayload) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
            let user = await this.prismaService.user.findFirst({
                where: { profileId: profile.id },
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
