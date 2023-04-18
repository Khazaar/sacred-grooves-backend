import {
    Body,
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
    NotFoundException,
} from "@nestjs/common";
import { AccessPayload } from "src/authz/accessPayload.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ArtistDto } from "./artist.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class ArtistsService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}
    public async createArtist(accessPayload: AccessPayload, dto: ArtistDto) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
            if (!profile) {
                throw new NotFoundException("Profile not found");
            }

            let artist = await this.prismaService.artist.create({
                data: {
                    profileId: profile.id,
                    musicStyles: {},
                    artistTypes: {},
                },
                include: {
                    profile: true,
                },
            });
            await this.prismaService.profile.update({
                where: { id: profile.id },
                data: {
                    artist: {
                        connect: {
                            id: artist.id,
                        },
                    },
                },
            });
            artist = await this.prismaService.artist.update({
                where: { profileId: profile.id },
                data: {
                    artistTypes: {
                        set: dto.artistTypes
                            ? dto.artistTypes?.map((artistType) => {
                                  return { artistTypeName: artistType };
                              })
                            : [],
                    },
                    musicStyles: {
                        set: dto.musicStyles
                            ? dto.musicStyles?.map((musicSlyle) => {
                                  return { musicStyleName: musicSlyle };
                              })
                            : [],
                    },
                },
                include: {
                    profile: true,
                    artistTypes: true,
                    musicStyles: true,
                },
            });
            return artist;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
    public async getAllArtists() {
        const artists = await this.prismaService.artist.findMany({
            include: {
                profile: true,
                artistTypes: true,
            },
        });
        return artists;
    }
    //test

    public async updateArtistMe(accessPayload: AccessPayload, dto: ArtistDto) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });

            if (!profile) {
                throw new NotFoundException("Profile not found");
            }
            const artist = await this.prismaService.artist.update({
                where: { profileId: profile.id },
                data: {
                    artistTypes: {
                        set: dto.artistTypes
                            ? dto.artistTypes?.map((artistType) => {
                                  return { artistTypeName: artistType };
                              })
                            : [],
                    },
                    musicStyles: {
                        set: dto.musicStyles
                            ? dto.musicStyles?.map((musicSlyle) => {
                                  return { musicStyleName: musicSlyle };
                              })
                            : [],
                    },
                },
                include: {
                    profile: true,
                    artistTypes: true,
                    musicStyles: true,
                },
            });

            return artist;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async deleteArtistMe(accessPayload: AccessPayload) {
        try {
            const profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });
            if (!profile) {
                throw new NotFoundException("Profile not found");
            }
            const artist = await this.prismaService.artist.delete({
                where: { profileId: profile.id },
            });
            return artist;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async getArtistById(artistId: number) {
        const artist = await this.prismaService.artist.findFirst({
            where: { id: artistId },
            include: {
                profile: true,
            },
        });
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        return artist;
    }
}
