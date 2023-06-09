import { EditUserDto } from "./dto/editUser.dto";
import { JwtGuard } from "./../auth/guard";
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Req,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorator";
import { User } from "@prisma/client";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    public async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get("me")
    public async getMe(@GetUser() user: User) {
        return user;
    }

    @Get(":id")
    public getUserById(@Param("id", ParseIntPipe) id: number) {
        return this.userService.getUserById(id);
    }
    @Patch(":id")
    editUser(@Param("id", ParseIntPipe) id: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(id, dto);
    }
}
