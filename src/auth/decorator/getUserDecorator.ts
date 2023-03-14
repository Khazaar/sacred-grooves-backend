import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: unknown, cts: ExecutionContext) => {
        const request = cts.switchToHttp().getRequest();
        return request.user;
    },
);
