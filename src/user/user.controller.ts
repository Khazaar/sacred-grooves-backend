import { CreateUserDto, EditUserDto } from "./user.dto";
import { JwtGuard } from "./../auth/guard";
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser, Roles } from "../auth/decorator";
import { User } from "@prisma/client";
import { UserService } from "./user.service";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Role } from "../auth/enums/roles.enum";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { AccessPayload } from "../authz/accessPayload.dto";
import { Permissions } from "../authz/permissions.decorator";
import { PermissionsGuard } from "../authz/permissions.guard";

@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    public async createUser(
        @Body() dto: CreateUserDto,
        @GetAccessPayload() accessPayload: AccessPayload,
    ) {
        return this.userService.createUser(dto, accessPayload);
    }

    @Get()
    @Permissions("read:users")
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
    ) {
        return await this.userService.editUser(accessPayload, dto);
    }

    @Get("email")
    @Permissions("read:users")
    public async getUserByEmail(@Body("email") email: string) {
        return await this.userService.getUserByEmail(email);
    }
    // @Patch(":id")
    // editUser(@Param("id", ParseIntPipe) id: number, @Body() dto: EditUserDto) {
    //     return this.userService.editUser(id, dto);
    // }
}
