import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get("DATABASE_URL"),
                },
            },
        });
    }

    public async cleadDb() {
        await this.$transaction([
            this.artist.deleteMany(),
            this.user.deleteMany(),
            this.supportTeam.deleteMany(),
            this.visitor.deleteMany(),
            this.event.deleteMany(),
            this.moderator.deleteMany(),
            this.artistType.deleteMany(),
            this.musicStyle.deleteMany(),
            this.supportTeam.deleteMany(),
            this.picture.deleteMany(),
            this.mapLocation.deleteMany(),
        ]);
    }
}
