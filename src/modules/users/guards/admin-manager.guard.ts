import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/users/enums/role.enum';
import { REQUIRED_ROLES_METADATA_KEY } from '@/modules/users/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AdminManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(REQUIRED_ROLES_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = this.getRequest(context);
    
    if (!this.isRequestWithUser(request)) {
      throw new ForbiddenException('Invalid request format');
    }

    const user = request.user;
    if (!this.isValidUser(user)) {
      throw new ForbiddenException('No valid user found in request');
    }

    return this.hasRequiredRole(user, requiredRoles);
  }

  private getRequest(context: ExecutionContext): unknown {
    return context.switchToHttp().getRequest();
  }

  private isRequestWithUser(request: unknown): request is RequestWithUser {
    return request !== null && 
           typeof request === 'object' && 
           'user' in request;
  }

  private isValidUser(user: unknown): user is User {
    return user !== null && 
           typeof user === 'object' && 
           'role' in user;
  }

  private hasRequiredRole(user: User, requiredRoles: Role[]): boolean {
    return requiredRoles.some(role => user.role === role);
  }
} 