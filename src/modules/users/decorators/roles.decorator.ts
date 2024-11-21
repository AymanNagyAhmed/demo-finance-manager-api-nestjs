import { SetMetadata } from '@nestjs/common';
import { Role } from '@/modules/users/enums/role.enum';

export const REQUIRED_ROLES_METADATA_KEY = 'requiredRoles';
export const Roles = (...roles: Role[]) => SetMetadata(REQUIRED_ROLES_METADATA_KEY, roles);