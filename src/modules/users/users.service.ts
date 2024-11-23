import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { QueryUserDto, SortOrder } from '@/modules/users/dto/query-user.dto';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  // Assuming you have some form of data storage
  private readonly users: any[] = [];

  create(createUserDto: CreateUserDto) {
    const user = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(query: QueryUserDto): PaginatedResponse<User> {
    const {
      searchTerm,
      phoneNumber,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 10,
    } = query;

    let filteredUsers = [...this.users];

    // Apply search filters
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (phoneNumber) {
      filteredUsers = filteredUsers.filter(user => 
        user.phoneNumber.includes(phoneNumber)
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      const compareValue = sortOrder === SortOrder.ASC ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * compareValue;
      if (a[sortBy] > b[sortBy]) return 1 * compareValue;
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      items: paginatedUsers,
      meta: {
        total: filteredUsers.length,
        page,
        lastPage: Math.ceil(filteredUsers.length / limit),
        limit,
      },
    };
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