import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { use } from "passport";
import { Role } from "../auth/enums/roles.enum";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ModeratorService {
    constructor(private readonly prismaService: PrismaService) {}
    public async grantModeratorRoleByUserId(userId: number) {
        const user = await this.prismaService.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (user.roles.some((role) => role === Role.Moderator)) {
            throw new InternalServerErrorException(
                "User is already a moderator",
            );
        }
        try {
            const moderator = await this.prismaService.moderator.create({
                data: {
                    userId: userId,
                },
            });
            await this.prismaService.user.update({
                where: { id: userId },
                data: {
                    roles: {
                        set: [...user.roles, Role.Moderator],
                    },
                    Moderator: {
                        connect: {
                            id: moderator.id,
                        },
                    },
                },
            });
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async grantModeratorRoleByUserEmail(userEmail: string) {
        const user = await this.prismaService.user.findFirst({
            where: { email: userEmail },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (user.roles.some((role) => role === Role.Moderator)) {
            throw new InternalServerErrorException(
                "User is already a moderator",
            );
        }
        try {
            const moderator = await this.prismaService.moderator.create({
                data: {
                    userId: user.id,
                },
            });
            await this.prismaService.user.update({
                where: { email: userEmail },
                data: {
                    roles: {
                        set: [...user.roles, Role.Moderator],
                    },
                    Moderator: {
                        connect: {
                            id: moderator.id,
                        },
                    },
                },
            });
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async revokeModeratorRoleByUserId(userId: number) {
        const user = await this.prismaService.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (!user.roles.some((role) => role === Role.Moderator)) {
            throw new InternalServerErrorException("User is not a moderator");
        }
        try {
            await this.prismaService.user.update({
                where: { id: userId },
                data: {
                    roles: {
                        set: user.roles.filter(
                            (role) => role !== Role.Moderator,
                        ),
                    },
                },
            });
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
