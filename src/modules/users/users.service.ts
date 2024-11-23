import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { QueryUserDto } from '@/modules/users/dto/query-user.dto';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';
import { User } from '@/modules/users/entities/user.entity';
import { UserExistsException } from '@/modules/users/exceptions/user-exists.exception';
import { DatabaseErrorService } from '@/common/services/database-error.service';
import * as bcrypt from 'bcrypt';
import { BaseQueryService } from '@/common/services/base-query.service';

@Injectable()
export class UsersService extends BaseQueryService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly databaseErrorService: DatabaseErrorService,
  ) {
    super();
  }

  /**
   * Create a new user
   * @param createUserDto - User creation data
   * @returns Created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.validateUniqueFields(createUserDto);
      
      const hashedPassword = await this.hashPassword(createUserDto.password);
      
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.databaseErrorService.handleError(error, 'UserService.create');
    }
  }

  /**
   * Find all users with pagination and filtering
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated user list
   */
  async findAll(query: QueryUserDto): Promise<PaginatedResponse<User>> {
    try {
      const allowedSortFields = ['firstName', 'lastName', 'email', 'createdAt'];
      const searchFields = [
        { field: 'firstName', alias: 'user' },
        { field: 'lastName', alias: 'user' },
        { field: 'email', alias: 'user' },
      ];

      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Apply search filters
      this.applySearch(queryBuilder, query.searchTerm, searchFields);

      // Apply phone number filter if provided
      if (query.phoneNumber) {
        queryBuilder.andWhere('user.phoneNumber = :phoneNumber', { 
          phoneNumber: query.phoneNumber 
        });
      }

      // Apply sorting
      this.applySorting(
        queryBuilder,
        query.sortBy,
        query.order,
        'user',
        allowedSortFields,
      );

      // Apply pagination
      this.applyPagination(queryBuilder, query);

      // Get results and count
      const [items, total] = await queryBuilder.getManyAndCount();

      return {
        items,
        meta: {
          total,
          page: query.page,
          lastPage: Math.ceil(total / query.take),
          limit: query.take,
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

  /**
   * Find user by ID
   * @param id - User UUID
   * @returns Found user
   * @throws NotFoundException if user not found
   */
  async findOne(id: string): Promise<User> {
    try {
      this.logger.log(`Fetching user with id: ${id}`);
      
      const user = await this.userRepository.findOne({
        where: { id },
      });

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

  /**
   * Find user by phone number
   * @param phoneNumber - User's phone number
   * @returns Found user
   * @throws NotFoundException if user not found
   */
  async findByPhone(phoneNumber: string): Promise<User> {
    try {
      this.logger.log(`Fetching user with phone number: ${phoneNumber}`);
      
      const user = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        throw new NotFoundException(`User with phone number ${phoneNumber} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user by phone: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update user by ID
   * @param id - User UUID
   * @param updateUserDto - Update data
   * @returns Updated user
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(`Updating user ${id}: ${JSON.stringify(updateUserDto)}`);
      
      const user = await this.findOne(id);
      
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      Object.assign(user, updateUserDto);
      
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Failed to update user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Remove user by ID
   * @param id - User UUID
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing user ${id}`);
      
      const user = await this.findOne(id);
      
      await this.userRepository.remove(user);
    } catch (error) {
      this.logger.error(
        `Failed to remove user ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validate unique fields before user creation
   * @param createUserDto - User creation data
   * @throws UserExistsException if email or phone already exists
   */
  private async validateUniqueFields(createUserDto: CreateUserDto): Promise<void> {
    const { email, phoneNumber } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [
        { email },
        { phoneNumber }
      ]
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

  /**
   * Hash password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
} 