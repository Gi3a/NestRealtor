import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
    async intercept(
        context: ExecutionContext,
        handler: CallHandler
    ) {

        const request = context.switchToHttp().getRequest();
        // [0] empty string
        // is there request? is there headers? other key is undefined
        const token = request?.headers?.authorization?.split("Bearer ")[1];
        const user = await jwt.decode(token);
        // put decoded user id into request
        request.user = user;

        return handler.handle();
    }
}