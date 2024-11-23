import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Role } from '@/modules/users/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  @Index('IDX_user_first_name')
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  @Index('IDX_user_last_name')
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  @Index('IDX_user_email')
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, unique: true })
  @Index('IDX_user_phone_number')
  phoneNumber: string;

  @Column({ 
    name: 'role',
    type: 'enum', 
    enum: Role, 
    default: Role.USER 
  })
  role: Role;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 