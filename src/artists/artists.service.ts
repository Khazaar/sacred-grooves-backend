import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArtistDto } from "./artist.dto";

@Injectable()
export class ArtistsService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createArtist(userId: number, dto: CreateArtistDto) {
        const artist = await this.prismaService.artist.create({
            data: {
                userId: userId,
                style: dto.style,
            },
        });
        return artist;
    }
    public async getAllArtists() {
        const artists = await this.prismaService.artist.findMany({
            include: {
                user: true,
            },
        });
        return artists;
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
