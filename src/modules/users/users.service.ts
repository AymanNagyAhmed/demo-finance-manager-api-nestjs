import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { QueryUserDto } from '@/modules/users/dto/query-user.dto';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';
import { UserExistsException } from './exceptions/user-exists.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.validateUniqueFields(createUserDto);
      
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      return await user.save();
    } catch (error) {
      this.logger.error(
        `Failed to create user: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(query: QueryUserDto): Promise<PaginatedResponse<User>> {
    try {
      const {
        searchTerm,
        phoneNumber,
        sortBy = 'createdAt',
        order = 'desc',
        page = 1,
        take = 10,
      } = query;

      const filter: any = {};

      if (searchTerm) {
        filter.$or = [
          { firstName: new RegExp(searchTerm, 'i') },
          { lastName: new RegExp(searchTerm, 'i') },
          { email: new RegExp(searchTerm, 'i') },
        ];
      }

      if (phoneNumber) {
        filter.phoneNumber = phoneNumber;
      }

      const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;

      const total = await this.userModel.countDocuments(filter);
      const items = await this.userModel
        .find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * take)
        .limit(take)
        .exec();

      return {
        items,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / take),
          limit: take,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch users: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to update user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to remove user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async validateUniqueFields(createUserDto: CreateUserDto): Promise<void> {
    const { email, phoneNumber } = createUserDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new UserExistsException('email', email);
      }
      if (existingUser.phoneNumber === phoneNumber) {
        throw new UserExistsException('phone number', phoneNumber);
      }
    }
  }

  async findByPhone(phoneNumber: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ phoneNumber }).exec();

      if (!user) {
        throw new NotFoundException(`User with phone number ${phoneNumber} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user by phone ${phoneNumber}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
} 