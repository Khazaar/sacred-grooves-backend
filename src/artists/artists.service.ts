import {
    Body,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { AccessPayload } from "src/authz/accessPayload.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArtistDto, UpdateArtistDto } from "./artist.dto";

@Injectable()
export class ArtistsService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createArtist(
        accessPayload: AccessPayload,
        dto: CreateArtistDto,
    ) {
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
                    artistTypes: {
                        connect:
                            dto.artistTypes.map((artistType) => {
                                return { artisitTypeName: artistType };
                            }) || [],
                    },
                },
                include: {
                    user: true,
                    artistTypes: true,
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
                        connect:
                            dto.artistTypes?.map((artistType) => {
                                return { artisitTypeName: artistType };
                            }) || [],
                    },
                    musicSlyles: {
                        connect:
                            dto.musicSlyles?.map((musicSlyle) => {
                                return { musicStyleName: musicSlyle };
                            }) || [],
                    },
                },
                include: {
                    user: true,
                    artistTypes: true,
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
