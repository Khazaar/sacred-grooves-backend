import { CreateUserDto, EditUserDto } from "./user.dto";
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    LoggerService,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { AccessPayload } from "../authz/accessPayload.dto";
import { Permissions } from "../authz/permissions.decorator";
import { PermissionsGuard } from "../authz/permissions.guard";
import { PermissionTypes } from "../authz/permissions.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CloudAwsService } from "../cloud-aws/cloud-aws.service";

@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly cloudAwsService: CloudAwsService,
    ) {}

    public maxSizeInBytes = 5 * 1024 * 1024; // 2 MB

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    public async createUser(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Body() dto: CreateUserDto,
        @UploadedFile() file,
    ) {
        let avatarUrl = "";
        try {
            if (file) {
                if (file.size > this.maxSizeInBytes) {
                    throw new BadRequestException(
                        "File size exceeds the maximum allowed size",
                    );
                }

                this.logger.log(file);
                avatarUrl = await this.cloudAwsService.uploadImageToS3AWS(file);
            }
            return this.userService.createUser(dto, accessPayload, avatarUrl);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    @Get()
    @Permissions(PermissionTypes.readUsers)
    public async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get("me")
    public async getMe(@GetAccessPayload() accessPayload: AccessPayload) {
        return await this.userService.getMe(accessPayload);
    }
    @Patch("me")
    public async editMe(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Body() dto: EditUserDto,
        @UploadedFile() file,
    ) {
        console.log(dto);
        let avatarUrl = "";
        try {
            if (file) {
                if (file.size > this.maxSizeInBytes) {
                    throw new BadRequestException(
                        "File size exceeds the maximum allowed size",
                    );
                }
                this.logger.log(file);
                avatarUrl = await this.cloudAwsService.uploadImageToS3AWS(file);
            }
            return await this.userService.editUser(
                accessPayload,
                dto,
                avatarUrl,
            );
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }

    @Get("email")
    @Permissions(PermissionTypes.readUsers)
    public async getUserByEmail(@Body("email") email: string) {
        return await this.userService.getUserByEmail(email);
    }
    // @Patch(":id")
    // editUser(@Param("id", ParseIntPipe) id: number, @Body() dto: EditUserDto) {
    //     return this.userService.editUser(id, dto);
    // }
}
