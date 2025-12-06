import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Request } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

type JwtPayload = { userID: number, userRole: string, userName: string };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const user = req.user;
    if (!user) throw new ForbiddenException('User not authenticated');

    const userRoles = Array.isArray(user.userRole) ? user.userRole : [user.userRole];
    const has = requiredRoles.some(r => userRoles.includes(r));

    if (!has) throw new ForbiddenException('Insufficient role');
    return true;

  }
}