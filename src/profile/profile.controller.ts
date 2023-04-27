import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    InternalServerErrorException,
    LoggerService,
    Param,
    ParseIntPipe,
    Post,
    Query,
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

    @Get()
    public async getProfiles(
        // @GetAccessPayload() accessPayload: AccessPayload,
        @Query("targetId", ParseIntPipe) targetId: number,
        @Query("targetRole") targetRole: string,
    ) {
        try {
            if (targetId !== 0) {
                return await this.profileService.getProfileById(targetId);
            }
            if (targetRole !== "undefined") {
                return await this.profileService.getProfilesByRole(targetRole);
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    @Get("ids")
    public async getProfileIds() {
        try {
            return await this.profileService.getProfilesIds();
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    @UseGuards(AuthGuard("jwt"), PermissionsGuard)
    @Post("me")
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
    @UseGuards(AuthGuard("jwt"), PermissionsGuard)
    @Post("me/role")
    public async claimRole(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Query("targetRole") targetRole: string,
    ) {
        try {
            return await this.profileService.claimRole(
                accessPayload,
                targetRole,
            );
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
    @Delete("me/role")
    public async abandonRole(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Query("targetRole") targetRole: string,
    ) {
        try {
            return await this.profileService.abandonRole(
                accessPayload,
                targetRole,
            );
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
