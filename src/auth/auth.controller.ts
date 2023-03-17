import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("signup")
    public async signup(@Body() dto: AuthDto) {
        return await this.authService.signup(dto);
    }
    @Post("signin")
    @HttpCode(200)
    public async signin(@Body() dto: AuthDto) {
        return await this.authService.signin(dto);
    }
}
