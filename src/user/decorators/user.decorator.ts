import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface UserInfo {
    name: string;
    id: number;
    iat: number;
    exp: number;
}

// creating our own decorator for using in id identification
export const User = createParamDecorator((data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
});