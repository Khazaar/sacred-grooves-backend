import { Injectable, NotFoundException } from "@nestjs/common";
import { Linter } from "eslint";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, EditUserDto } from "./user.dto";
import * as argon from "argon2";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    public async createUser(dto: CreateUserDto) {
        const passwordHash = await argon.hash(dto.password);
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                passwordHash: passwordHash,
                nickName: dto.nickName,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public async getAllUsers() {
        const users = await this.prismaService.user.findMany();
        users.forEach((user) => delete user.passwordHash);
        return users;
    }

    public async getUserById(userId: number) {
        const user = await this.prismaService.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    public async editUser(userId: number, data: EditUserDto) {
        let user = await this.prismaService.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        user = await this.prismaService.user.update({
            where: { id: userId },
            data,
        });
        delete user.passwordHash;
        return user;
    }
}
