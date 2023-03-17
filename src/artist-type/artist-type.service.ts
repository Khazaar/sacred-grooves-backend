import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArtistTypeDto } from "./artist-type.dto";

@Injectable()
export class ArtistTypeService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createArtistType(dto: CreateArtistTypeDto) {
        try {
            const artistType = await this.prismaService.artistType.create({
                data: {
                    artisitTypeName: dto.artisitTypeName,
                },
            });
            return artistType;
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
    public async getAllArtistTypes() {
        const artistType = await this.prismaService.artistType.findMany();
        return artistType;
    }
    public async getArtistTypeById(artistTypeId: number) {
        const artistType = await this.prismaService.artistType.findFirst({
            where: { id: artistTypeId },
        });
        return artistType;
    }
    public async updateArtistTypeById(
        artistTypeId: number,
        dto: CreateArtistTypeDto,
    ) {
        const artistType = await this.prismaService.artistType.update({
            where: { id: artistTypeId },
            data: {
                artisitTypeName: dto.artisitTypeName,
            },
        });
        return artistType;
    }

    public async deleteArtistTypeById(artistTypeId: number) {
        const artistType = await this.prismaService.artistType.delete({
            where: { id: artistTypeId },
        });
        return artistType;
    }
}
