import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    return this.users.find(user => user.id === id);
  }

  /**
   * Find a user by phone number
   * @param phoneNumber - The phone number to search for
   * @returns The user with the matching phone number or undefined
   */
  findByPhone(phoneNumber: string) {
    return this.users.find(user => user.phoneNumber === phoneNumber);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };
      return this.users[userIndex];
    }
    return null;
  }

  remove(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      const [removedUser] = this.users.splice(userIndex, 1);
      return removedUser;
    }
    return null;
  }
} 