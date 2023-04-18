import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProfileService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly prismaService: PrismaService,
    ) {}

    public async createProfile(auth0sub: string) {
        const profile = await this.prismaService.profile.create({
            data: {
                auth0sub,
            },
        });
        return profile;
    }

    public async getProfile(auth0sub: string) {
        const profile = await this.prismaService.profile.findUnique({
            where: { auth0sub },
            include: {
                user: true,
                organizer: true,
                artist: true,
            },
        });
        return profile;
    }
}
