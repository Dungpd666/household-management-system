import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RoleEnum } from 'src/roles/roles.enum';

@Injectable()
export class HouseholdAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.userRole !== RoleEnum.household) {
      throw new ForbiddenException('Access denied');
    }

    if (user.userType !== 'household') {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
