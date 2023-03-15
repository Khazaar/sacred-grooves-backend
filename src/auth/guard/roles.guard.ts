import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Role } from "../enums/roles.enum";

@Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) {}

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
//             ROLES_KEY,
//             [context.getHandler(), context.getClass()],
//         );
//         if (!requiredRoles) {
//             return true;
//         }
//         const { user } = context.switchToHttp().getRequest();
//         return requiredRoles.some((role) => user.roles?.includes(role));
//     }
// }
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler(),
        );
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        return roles.includes(user.roles[0]);
    }
}
