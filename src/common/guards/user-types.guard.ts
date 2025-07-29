import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserTypesGuard implements CanActivate {
    constructor(private allowedTypes: string[]) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return user && this.allowedTypes.includes(user.type);
    }
}