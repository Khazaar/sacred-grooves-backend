import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
        });
    }
    async validate(payload: { sub: number; email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        if (!user) {
            throw new NotFoundException();
        }
        delete user.passwordHash;
        return user;
    }
}
