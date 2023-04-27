import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { PrismaService } from "../prisma/prisma.service";
import { AccessPayload } from "src/authz/accessPayload.dto";

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

    public async getProfileById(id: number) {
        try {
            let profile = await this.prismaService.profile.findMany({
                where: { id },
                include: {
                    user: {
                        include: {
                            avatar: true,
                            mapLocation: true,
                        },
                    },
                    organizer: true,
                    artist: true,
                },
            });
            if (profile) {
                return profile;
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    public async getProfilesByRole(targetRole: string) {
        try {
            switch (targetRole) {
                case "artist": {
                    const artistProfiles =
                        await this.prismaService.profile.findMany({
                            where: { artist: { is: {} } },
                            include: {
                                artist: {
                                    include: {
                                        musicStyles: true,
                                        artistTypes: true,
                                    },
                                },
                            },
                        });
                    return artistProfiles;
                }
                case "organizer":
                    const organizerProfiles =
                        await this.prismaService.profile.findMany({
                            where: { organizer: { is: {} } },
                        });
                    return organizerProfiles;
                case "any":
                    const anyProfiles =
                        await this.prismaService.profile.findMany({
                            include: {
                                user: {
                                    include: {
                                        avatar: true,
                                    },
                                },
                                artist: {
                                    include: {
                                        musicStyles: true,
                                        artistTypes: true,
                                    },
                                },
                                organizer: true,
                            },
                        });
                    return anyProfiles;
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
    public async getProfilesIds() {
        try {
            const ids: number[] = [];
            const profiles = await this.prismaService.profile.findMany({});
            profiles.forEach((profile) => {
                ids.push(profile.id);
            });
            return ids;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    public async claimRole(accessPayload: AccessPayload, targetRole: string) {
        try {
            let profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
            switch (targetRole) {
                case "artist": {
                    const artist = await this.prismaService.artist.create({
                        data: {
                            profileId: profile.id,
                        },
                    });
                    const musicStyles =
                        await this.prismaService.musicStyle.findMany({});
                    musicStyles.map(async (musicStyle) => {
                        await this.prismaService.artist.update({
                            where: { id: artist.id },
                            data: {
                                musicStyles: {
                                    connect: {
                                        id: musicStyle.id,
                                    },
                                },
                            },
                        });
                    });

                    const artistType =
                        await this.prismaService.artistType.findMany({});
                    artistType.map(async (artistType) => {
                        await this.prismaService.artist.update({
                            where: { id: artist.id },
                            data: {
                                artistTypes: {
                                    connect: {
                                        id: artistType.id,
                                    },
                                },
                            },
                        });
                    });
                    profile = await this.prismaService.profile.update({
                        where: { id: profile.id },
                        data: {
                            artist: {
                                connect: {
                                    id: artist.id,
                                },
                            },
                        },
                        include: {
                            artist: {
                                include: {
                                    musicStyles: true,
                                    artistTypes: true,
                                },
                            },
                        },
                    });
                    return profile;
                }
                case "organizer": {
                    const organizer = await this.prismaService.organizer.create(
                        {
                            data: {
                                profileId: profile.id,
                            },
                        },
                    );
                    return organizer;
                }
                default: {
                    throw new InternalServerErrorException("Bad role request");
                }
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    public async abandonRole(accessPayload: AccessPayload, targetRole: string) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
            switch (targetRole) {
                case "artist": {
                    const artist = await this.prismaService.artist.delete({
                        where: { profileId: profile.id },
                    });
                    return artist;
                }
                case "organizer": {
                    const organizer = await this.prismaService.organizer.delete(
                        {
                            where: { profileId: profile.id },
                        },
                    );
                    return organizer;
                }
                default: {
                    throw new InternalServerErrorException("Bad role request");
                }
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
}
