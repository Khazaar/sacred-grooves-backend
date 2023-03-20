import { PrismaService } from "./../prisma/prisma.service";
import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from "argon2";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "../authz/auth.dto";
@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}
    public async signin(dto: AuthDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new ForbiddenException("User not found");
        }

        const passwordMatch = await argon.verify(
            user.passwordHash,
            dto.password,
        );
        if (!passwordMatch) {
            throw new ForbiddenException("Password does not match");
        }
        return await this.signToken(user.id, user.email);
    }
    public async signup(dto: AuthDto) {
        const passwordHash = await argon.hash(dto.password);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    passwordHash: passwordHash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },
            });

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Field already in use");
                }
            }
        }
    }

    private async signToken(userId: number, email: string) {
        const token = await this.jwt.signAsync(
            {
                sub: userId,
                email,
            },
            { expiresIn: "15h", secret: this.config.get("JWT_SECRET") },
        );
        return { access_token: token };
    }
}
