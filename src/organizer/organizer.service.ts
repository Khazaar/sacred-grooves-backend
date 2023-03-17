import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { Role } from "../auth/enums/roles.enum";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizerDto } from "./organizer.dto";

@Injectable()
export class OrganizerService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createOrganizer(userId: number, dto: CreateOrganizerDto) {
        const user = await this.prismaService.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (user.roles.some((role) => role === Role.Organizer)) {
            throw new InternalServerErrorException(
                "User is already an Organizer",
            );
        }
        const organizer = await this.prismaService.organizer.create({
            data: {
                userId: userId,
                mainLocation: dto.mainLocation,
            },
            include: {
                user: true,
            },
        });
        await this.prismaService.user.update({
            where: { id: userId },
            data: {
                roles: {
                    set: [...user.roles, Role.Organizer],
                },
                Organizer: {
                    connect: {
                        id: organizer.id,
                    },
                },
            },
        });
        return organizer;
    }
    public async getAllOrganizers() {
        const organizer = await this.prismaService.organizer.findMany({
            include: {
                user: true,
            },
        });
        return organizer;
    }
}
