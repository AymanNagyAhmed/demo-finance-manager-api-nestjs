import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/users/enums/role.enum';

@Injectable()
export class AdminManagerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (!user.role || (user.role !== Role.ADMIN && user.role !== Role.MANAGER)) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }

    return true;
  }
} 