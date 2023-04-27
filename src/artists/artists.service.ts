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
import { ArtistTypeDto } from "src/artist-type/artist-type.dto";
import { MusicStyleDto } from "src/music-style/music-style.dto";

@Injectable()
export class ArtistsService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    public async updateArtistMe(accessPayload: AccessPayload, dto: ArtistDto) {
        try {
            let profile = await this.prismaService.profile.findUnique({
                where: { auth0sub: accessPayload.sub },
            });

            if (!profile) {
                throw new NotFoundException("Profile not found");
            }

            let artist = await this.prismaService.artist.findUnique({
                where: { profileId: profile.id },
            });

            if (dto.artistTypes) {
                for (const artistType of dto.artistTypes) {
                    const atPrisma =
                        await this.prismaService.artistType.findMany({
                            where: {
                                AND: [
                                    {
                                        artistTypeName:
                                            artistType.artistTypeName,
                                    },
                                    { artistId: artist.id },
                                ],
                            },
                        });
                    if (atPrisma) {
                        await this.prismaService.artistType.update({
                            where: {
                                id: atPrisma[0].id,
                            },
                            data: {
                                isSelected: artistType.isSelected,
                            },
                        });
                        artist = await this.prismaService.artist.update({
                            where: { id: artist.id },
                            data: {
                                artistTypes: {
                                    connect: {
                                        id: atPrisma[0].id,
                                    },
                                },
                            },
                            include: {
                                artistTypes: true,
                            },
                        });
                    }
                }
            }

            if (dto.musicStyles) {
                for (const musicStyle of dto.musicStyles) {
                    const atPrisma =
                        await this.prismaService.musicStyle.findMany({
                            where: {
                                AND: [
                                    {
                                        musicStyleName:
                                            musicStyle.musicStyleName,
                                    },
                                    { artistId: artist.id },
                                ],
                            },
                        });
                    if (atPrisma) {
                        await this.prismaService.musicStyle.update({
                            where: {
                                id: atPrisma[0].id,
                            },
                            data: {
                                isSelected: musicStyle.isSelected,
                            },
                        });
                        artist = await this.prismaService.artist.update({
                            where: { id: artist.id },
                            data: {
                                musicStyles: {
                                    connect: {
                                        id: atPrisma[0].id,
                                    },
                                },
                            },
                            include: {
                                musicStyles: true,
                            },
                        });
                    }
                }
            }

            return artist;
        } catch (error) {
            this.logger.error(error);
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
