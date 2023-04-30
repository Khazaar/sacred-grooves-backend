import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MusicStyleDto } from "./music-style.dto";

@Injectable()
export class MusicStyleService {
    constructor(private readonly prismaService: PrismaService) {}
    public async createMusicStyle(dto: MusicStyleDto) {
        try {
            const artists = await this.prismaService.artist.findMany({});
            const musicStyle = await this.prismaService.musicStyle.create({
                data: {
                    musicStyleName: dto.musicStyleName,
                    isSelected: false,
                },
            });
            artists.map(async (artist) => {
                await this.prismaService.artist.update({
                    where: { id: artist.id },
                    data: {
                        musicStyles: {
                            connect: { id: musicStyle.id },
                        },
                    },
                });
            });

            return musicStyle;
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    public async getAllMusicStyles() {
        const musicStyle = await this.prismaService.musicStyle.findMany();
        return musicStyle;
    }

    public async getMusicStyleById(musicStyleId: number) {
        try {
            const musicStyle = await this.prismaService.musicStyle.findFirst({
                where: { id: musicStyleId },
            });
            return musicStyle;
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
    public async updateMusicStyleById(
        musicStyleId: number,
        dto: MusicStyleDto,
    ) {
        try {
            const musicStyle = await this.prismaService.musicStyle.update({
                where: { id: musicStyleId },
                data: {
                    musicStyleName: dto.musicStyleName,
                },
            });
            return musicStyle;
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    public async deleteMusicStyleById(musicStyleId: number) {
        try {
            const musicStyle = await this.prismaService.musicStyle.delete({
                where: { id: musicStyleId },
            });
            return musicStyle;
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
}
