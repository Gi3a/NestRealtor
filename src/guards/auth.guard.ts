import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common"
import { Reflector } from '@nestjs/core'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from "src/prisma/prisma.service";

interface JWTPayload {
    name: string;
    id: number;
    iat: number;
    exp: number;
}

// CanActivate - Using for Roles to have permission to act some actions
// reflector acccess to metadata
// inject to our service
@Injectable()
export class AuthGuard implements CanActivate {


    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService
    ) { }

    async canActivate(context: ExecutionContext) {
        // 1) Determine the UserTypes that can execute the endpoint
        // specify keys of metadata
        // get array of usertypes
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass()
        ]);


        // 2) Grab the JWT from request header and verify it
        if (roles?.length) {
            const request = context.switchToHttp().getRequest();
            const token = request.headers?.authorization?.split('Bearer ')[1];
            try {
                // as is giving information about interface
                const payload = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as JWTPayload;

                // 3) DB request to get user by id
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: payload.id
                    }
                });

                if (!user) return false;
                // [user.admin, user.realtor].includes(user.realtor )
                // 4) If user have permission
                if (roles.includes(user.user_type)) return true;

                return false;
            } catch (error) {
                return false;
            }
        }
        return true;
    }
}