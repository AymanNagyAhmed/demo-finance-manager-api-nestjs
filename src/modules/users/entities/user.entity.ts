import { Role } from '@/modules/users/enums/role.enum';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
} 