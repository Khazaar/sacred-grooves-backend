import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AccessPayload } from "./accessPayload.dto";

export const GetAccessPayload = createParamDecorator(
    (data: unknown, cts: ExecutionContext) => {
        const request = cts.switchToHttp().getRequest();
        const accessPayload: AccessPayload = {
            sub: request.user.sub,
            permissions: request.user.permissions,
        };
        return accessPayload;
    },
);
