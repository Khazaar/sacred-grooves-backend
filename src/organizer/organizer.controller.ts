import { OrganizerDto } from "./organizer.dto";
import { OrganizerService } from "./organizer.service";
import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { AccessPayload } from "../authz/accessPayload.dto";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { AuthGuard } from "@nestjs/passport";
import { PermissionsGuard } from "../authz/permissions.guard";

@UseGuards(AuthGuard("jwt"), PermissionsGuard)
@Controller("organizers")
export class OrganizerController {
    constructor(private readonly organizerService: OrganizerService) {}

    @Post()
    public async createOrganizer(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Body() dto: OrganizerDto,
    ) {
        return await this.organizerService.createOrganizer(accessPayload, dto);
    }
    @Patch("me")
    public async updateOrganizer(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Body() dto: OrganizerDto,
    ) {
        return await this.organizerService.updateOrganizer(accessPayload, dto);
    }

    @Get()
    public async getAllOrganizers() {
        return await this.organizerService.getAllOrganizers();
    }
}
