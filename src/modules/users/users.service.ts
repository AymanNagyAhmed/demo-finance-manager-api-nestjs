import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  // Assuming you have some form of data storage
  private readonly users: any[] = [];

  create(createUserDto: CreateUserDto) {
    const user = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  findByPhone(phoneNumber: string) {
    const user = this.users.find(user => user.phoneNumber === phoneNumber);
    if (!user) {
      throw new NotFoundException(`User with phone number ${phoneNumber} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };
    
    return this.users[userIndex];
  }

  remove(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const [removedUser] = this.users.splice(userIndex, 1);
    return removedUser;
  }
} 