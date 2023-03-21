import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { AccessPayload } from "src/authz/accessPayload.dto";
import { Role } from "../auth/enums/roles.enum";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizerDto, UpdateOrganizerDto } from "./organizer.dto";

@Injectable()
export class OrganizerService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createOrganizer(
        usaccessPayloadrId: AccessPayload,
        dto: CreateOrganizerDto,
    ) {
        const user = await this.prismaService.user.findFirst({
            where: { auth0sub: usaccessPayloadrId.sub },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const organizer = await this.prismaService.organizer.create({
            data: {
                userId: user.id,
                mainLocation: dto.mainLocation,
            },
            include: {
                user: true,
            },
        });
        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                Organizer: {
                    connect: {
                        id: organizer.id,
                    },
                },
            },
        });
        return organizer;
    }

    public async updateOrganizer(
        usaccessPayloadrId: AccessPayload,
        dto: UpdateOrganizerDto,
    ) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: usaccessPayloadrId.sub },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }
            const organizer = await this.prismaService.organizer.update({
                where: { userId: user.id },
                data: {
                    mainLocation: dto.mainLocation,
                },
                include: {
                    user: true,
                },
            });
            return organizer;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
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
