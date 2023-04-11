import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { PrismaService } from "../prisma/prisma.service";
import { CreateArtistTypeDto } from "./artist-type.dto";

@Injectable()
export class ArtistTypeService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}
    public async createArtistType(dto: CreateArtistTypeDto) {
        try {
            const artistType = await this.prismaService.artistType.create({
                data: {
                    artistTypeName: dto.artistTypeName,
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
                artistTypeName: dto.artistTypeName,
            },
        });
        return artistType;
    }

    public async deleteArtistTypeById(artistTypeId: number) {
        try {
            const artistType = await this.prismaService.artistType.delete({
                where: { id: artistTypeId },
            });
            return artistType;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
}
