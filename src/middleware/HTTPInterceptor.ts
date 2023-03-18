import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    LoggerService,
    NestInterceptor,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { tap } from "rxjs";
import {
    WINSTON_MODULE_NEST_PROVIDER,
    WINSTON_MODULE_PROVIDER,
} from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class HTTPInterceptor implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}
    intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();
        const { originalUrl, method, params, query, body } = req;
        this.logger.log(
            {
                originalUrl,
                method,
                params,
                query,
                body,
            },
            "HTTP Request",
        );
        return next.handle().pipe(
            tap((data) =>
                this.logger.log(
                    {
                        statusCode,
                        data,
                    },
                    "HTTP Response",
                ),
            ),
        );
    }
}
