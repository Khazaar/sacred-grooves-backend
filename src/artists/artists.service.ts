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
import { CreateArtistDto, UpdateArtistDto } from "./artist.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class ArtistsService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}
    public async createArtist(accessPayload: AccessPayload) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }

            const artist = await this.prismaService.artist.create({
                data: {
                    userId: user.id,
                    musicSlyles: {},
                    artistTypes: {},
                },
                include: {
                    user: true,
                },
            });
            await this.prismaService.user.update({
                where: { id: user.id },
                data: {
                    artist: {
                        connect: {
                            id: artist.id,
                        },
                    },
                },
            });
            return artist;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    public async getAllArtists() {
        const artists = await this.prismaService.artist.findMany({
            include: {
                user: true,
                artistTypes: true,
            },
        });
        return artists;
    }

    public async updateArtistMe(
        accessPayload: AccessPayload,
        dto: UpdateArtistDto,
    ) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }
            const artist = await this.prismaService.artist.update({
                where: { userId: user.id },
                data: {
                    artistTypes: {
                        set:
                            dto.artistTypes?.map((artistType) => {
                                return { artistTypeName: artistType };
                            }) || [],
                    },
                    musicSlyles: {
                        set:
                            dto.musicStyles?.map((musicSlyle) => {
                                return { musicStyleName: musicSlyle };
                            }) || [],
                    },
                },
                include: {
                    user: true,
                    artistTypes: true,
                    musicSlyles: true,
                },
            });

            return artist;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async deleteArtistMe(accessPayload: AccessPayload) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }
            const artist = await this.prismaService.artist.delete({
                where: { userId: user.id },
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
                user: true,
            },
        });
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        return artist;
    }
}
