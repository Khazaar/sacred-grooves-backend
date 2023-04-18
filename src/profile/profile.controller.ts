import {
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    LoggerService,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AccessPayload } from "../authz/accessPayload.dto";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { PermissionsGuard } from "../authz/permissions.guard";
import { ProfileService } from "./profile.service";

@Controller("profiles")
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}
    @UseGuards(AuthGuard("jwt"), PermissionsGuard)
    @Get()
    public async getProfile(@GetAccessPayload() accessPayload: AccessPayload) {
        try {
            return this.profileService.getProfile(accessPayload.sub);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    @UseGuards(AuthGuard("jwt"), PermissionsGuard)
    @Post()
    public async createProfile(
        @GetAccessPayload() accessPayload: AccessPayload,
    ) {
        try {
            return this.profileService.createProfile(accessPayload.sub);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
