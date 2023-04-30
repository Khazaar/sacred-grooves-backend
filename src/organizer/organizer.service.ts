import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { AccessPayload } from "src/authz/accessPayload.dto";
import { PrismaService } from "../prisma/prisma.service";
import { OrganizerDto } from "./organizer.dto";

@Injectable()
export class OrganizerService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createOrganizer(
        accessPayload: AccessPayload,
        dto: OrganizerDto,
    ) {
        const profile = await this.prismaService.profile.findUnique({
            where: { auth0sub: accessPayload.sub },
        });
        if (!profile) {
            throw new NotFoundException("Profile not found");
        }
        const organizer = await this.prismaService.organizer.create({
            data: {
                profile: {
                    connect: {
                        id: profile.id,
                    },
                },
                mainLocation: dto.mainLocation,
                events: {},
            },
            include: {
                profile: true,
            },
        });
        await this.prismaService.profile.update({
            where: { id: profile.id },
            data: {
                organizer: {
                    connect: {
                        id: organizer.id,
                    },
                },
            },
        });
        return organizer;
    }
    //test

    public async updateOrganizer(
        accessPayload: AccessPayload,
        dto: OrganizerDto,
    ) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
            if (!profile) {
                throw new NotFoundException("Profile not found");
            }
            const organizer = await this.prismaService.organizer.update({
                where: { profileId: profile.id },
                data: {
                    mainLocation: dto.mainLocation,
                },
                include: {
                    profile: true,
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
                profile: true,
            },
        });
        return organizer;
    }
}
