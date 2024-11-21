import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/users/enums/role.enum';

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AdminManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);
    
    if (!this.isRequestWithUser(request)) {
      throw new ForbiddenException('Invalid request format');
    }

    const user = request.user;
    if (!this.isValidUser(user)) {
      throw new ForbiddenException('No valid user found in request');
    }

    if (!this.hasValidRole(user)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
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

  private hasValidRole(user: User): boolean {
    const allowedRoles = [Role.ADMIN, Role.MANAGER];
    return user.role !== undefined && allowedRoles.includes(user.role);
  }
} 