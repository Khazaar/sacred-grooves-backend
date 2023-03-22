import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, EditUserDto } from "./user.dto";
import * as argon from "argon2";
import { AccessPayload } from "../authz/accessPayload.dto";
import { Prisma } from "@prisma/client";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CloudAwsService } from "../cloud-aws/cloud-aws.service";

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly prismaService: PrismaService,
        private readonly cloudAwsService: CloudAwsService,
    ) {}

    public async createUser(
        dto: CreateUserDto,
        accessPayload: AccessPayload,
        avatarUrl: any,
    ) {
        const passwordHash = await argon.hash(dto.password);
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                passwordHash: passwordHash,
                nickName: dto.nickName,
                auth0sub: accessPayload.sub,
                avatar: {
                    create: {
                        pictureS3Url: avatarUrl,
                        title: `Avatar for ${dto.nickName}`,
                    },
                },
            },
            include: {
                avatar: true,
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

    public async getUserByEmail(email: string) {
        const user = await this.prismaService.user.findFirst({
            where: { email: email },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    public async editUser(accessPayload: AccessPayload, data: EditUserDto) {
        let user = await this.prismaService.user.findFirst({
            where: { auth0sub: accessPayload.sub },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        user = await this.prismaService.user.update({
            where: { auth0sub: accessPayload.sub },
            data,
        });
        delete user.passwordHash;
        return user;
    }

    public async getMe(accessPayload: AccessPayload) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { auth0sub: accessPayload.sub },
            });
            if (!user) {
                throw new NotFoundException("User not found");
            }

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(error);
                throw new InternalServerErrorException(error);
            }
        }
    }
}
