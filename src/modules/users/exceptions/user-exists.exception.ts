import { ConflictException } from '@nestjs/common';

export class UserExistsException extends ConflictException {
  constructor(field: string, value: string) {
    super(`User with ${field.toLowerCase()} '${value}' already exists`);
  }
} 