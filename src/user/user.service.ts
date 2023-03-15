import { Injectable, NotFoundException } from "@nestjs/common";
import { Linter } from "eslint";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, EditUserDto } from "./user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    public async createUser(userId: number, data: CreateUserDto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                nickName: data.nickName,
                roles: data.roles,
            },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public async getAllUsers() {
        const users = await this.prisma.user.findMany();
        users.forEach((user) => delete user.passwordHash);
        return users;
    }

    public async getUserById(userId: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    public async editUser(userId: number, data: EditUserDto) {
        let user = await this.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        delete user.passwordHash;
        return user;
    }
}
