import { EventService } from "./event.service";
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    LoggerService,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { CreateEventDto, UpdateEventDto } from "./event.dto";
import { AccessPayload } from "../authz/accessPayload.dto";
import { GetAccessPayload } from "../authz/getAccessPayloadDecorator";
import { PermissionTypes } from "../authz/permissions.enum";
import { Permissions } from "../authz/permissions.decorator";
import { PermissionsGuard } from "../authz/permissions.guard";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CloudAwsService } from "src/cloud-aws/cloud-aws.service";

@UseGuards(JwtGuard, PermissionsGuard)
@Controller("events")
export class EventController {
    constructor(
        private readonly eventService: EventService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private readonly cloudAwsService: CloudAwsService,
    ) {}
    public maxSizeInBytes = 3 * 1024 * 1024; // 2 MB

    @Post()
    public async createEvent(
        @Body() dto: CreateEventDto,
        @GetAccessPayload() accessPayload: AccessPayload,
        @UploadedFile() file,
    ) {
        let posterUrl = "";
        if (file) {
            if (file.size > this.maxSizeInBytes) {
                throw new BadRequestException(
                    "File size exceeds the maximum allowed size",
                );
            }
            try {
                this.logger.log(file);
                posterUrl = await this.cloudAwsService.uploadImageToS3AWS(file);
                return await this.eventService.createEvent(
                    accessPayload,
                    dto,
                    posterUrl,
                );
            } catch (error) {
                this.logger.error(error);
                throw new BadRequestException(error);
            }
        }
    }
    @Get()
    public async getAllEvents() {
        return await this.eventService.getAllevents();
    }
    @Get("pending")
    @Permissions(PermissionTypes.rudEvents)
    public async getAllPengingEvents() {
        return await this.eventService.getAllPengingEvents();
    }
    // @Get(":id")
    // public async getEventById(@Param("id", ParseIntPipe) id: number) {
    //     return await this.eventService.getEventById(id);
    // }
    @Patch(":id")
    public async updateEventById(
        @GetAccessPayload() accessPayload: AccessPayload,
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateEventDto,
    ) {
        return await this.eventService.updateEventById(accessPayload, id, dto);
    }

    @Permissions(PermissionTypes.rudEvents)
    @Patch("/pending/:id")
    public async approvePendingEventById(
        @Param("id", ParseIntPipe) id: number,
    ) {
        return await this.eventService.approveEventById(id);
    }

    @Permissions(PermissionTypes.rudEvents)
    @Delete("/pending/:id")
    public async deletePendingEventById(@Param("id", ParseIntPipe) id: number) {
        return await this.eventService.deletePendingEventById(id);
    }
}
