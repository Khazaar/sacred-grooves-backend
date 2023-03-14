import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("signup")
    public async signup(@Body() dto: AuthDto) {
        await this.authService.signup(dto);
    }
    @Post("signin")
    @HttpCode(200)
    public signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}
