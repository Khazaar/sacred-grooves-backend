import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrganizerDto } from "./organizer.dto";

@Injectable()
export class OrganizerService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createOrganizer(userId: number, dto: CreateOrganizerDto) {
        const organizer = await this.prismaService.organizer.create({
            data: {
                userId: userId,
                mainLocation: dto.mainLocation,
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
