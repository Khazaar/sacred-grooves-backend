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
    public cleadDb() {
        this.$transaction([this.artist.deleteMany(), this.user.deleteMany()]);
        this.$transaction([this.user.deleteMany(), this.user.deleteMany()]);
        this.$transaction([
            this.organizer.deleteMany(),
            this.user.deleteMany(),
        ]);
        this.$transaction([this.visitor.deleteMany(), this.user.deleteMany()]);
        this.$transaction([this.event.deleteMany(), this.user.deleteMany()]);
        this.$transaction([
            this.moderator.deleteMany(),
            this.user.deleteMany(),
        ]);
        this.$transaction([
            this.artistType.deleteMany(),
            this.user.deleteMany(),
        ]);
        this.$transaction([
            this.musicStyle.deleteMany(),
            this.user.deleteMany(),
        ]);
        this.$transaction([
            this.supportTeam.deleteMany(),
            this.user.deleteMany(),
        ]);
    }
}
