import {
    BadRequestException,
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Post,
} from "@nestjs/common";
import { GrantModeratorDto } from "./moderator.dto";
import { ModeratorService } from "./moderator.service";

@Controller("moderators")
export class ModeratorController {
    constructor(private readonly moderatorService: ModeratorService) {}
    @Post("grant")
    public async grantModeratorRole(@Body() data: GrantModeratorDto) {
        if (data.userId) {
            return await this.moderatorService.grantModeratorRoleByUserId(
                Number(data.userId),
            );
        } else {
            if (data.userEmail) {
                return await this.moderatorService.grantModeratorRoleByUserEmail(
                    data.userEmail,
                );
            } else {
                return new BadRequestException("No user id or email provided");
            }
        }
    }

    public async revokeModeratorRoleByUserId(
        @Param("id", ParseIntPipe) id: number,
    ) {
        return await this.moderatorService.revokeModeratorRoleByUserId(id);
    }
}
