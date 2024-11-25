import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Role } from './enums/role.enum';
import { NotFoundException } from '@nestjs/common';
import { UserExistsException } from './exceptions/user-exists.exception';
import { Order } from '@/common/dto/page-options.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = {
    _id: 'some-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    role: Role.USER,
    isActive: true,
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateUserDto: CreateUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    password: 'password123',
  };

  const mockQueryUserDto: QueryUserDto = {
    searchTerm: '',
    phoneNumber: '',
    sortBy: 'createdAt',
    order: Order.DESC,
    page: 1,
    take: 10,
    get skip(): number {
      return (this.page - 1) * this.take;
    }
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword' as never);
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(mockUserModel, 'create').mockImplementationOnce(() => ({
        ...mockUser,
        save: () => mockUser,
      }));

      const result = await service.create(mockCreateUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should throw UserExistsException if email exists', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(mockUser);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(UserExistsException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [mockUser];

      jest.spyOn(mockUserModel, 'find').mockReturnValue({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              exec: () => mockUsers,
            }),
          }),
        }),
      } as any);
      
      jest.spyOn(mockUserModel, 'countDocuments').mockResolvedValueOnce(1);

      const result = await service.findAll(mockQueryUserDto);

      expect(result.items).toEqual(mockUsers);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(mockQueryUserDto.page);
      expect(result.meta.limit).toBe(mockQueryUserDto.take);
      expect(mockUserModel.find).toHaveBeenCalled();
      expect(mockUserModel.countDocuments).toHaveBeenCalled();
    });

    it('should apply search filters correctly', async () => {
      const searchQuery: QueryUserDto = {
        ...mockQueryUserDto,
        searchTerm: 'John',
        get skip(): number {
          return (this.page - 1) * this.take;
        }
      };
      const mockUsers = [mockUser];

      jest.spyOn(mockUserModel, 'find').mockReturnValue({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              exec: () => mockUsers,
            }),
          }),
        }),
      } as any);

      await service.findAll(searchQuery);

      expect(mockUserModel.find).toHaveBeenCalledWith({
        $or: expect.any(Array),
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(mockUserModel, 'findById').mockReturnValue({
        exec: () => mockUser,
      } as any);

      const result = await service.findOne('some-id');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('some-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(mockUserModel, 'findById').mockReturnValue({
        exec: () => null,
      } as any);

      await expect(service.findOne('some-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByPhone', () => {
    it('should return a user by phone number', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockReturnValue({
        exec: () => mockUser,
      } as any);

      const result = await service.findByPhone('+1234567890');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ phoneNumber: '+1234567890' });
    });

    it('should throw NotFoundException if user not found by phone', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockReturnValue({
        exec: () => null,
      } as any);

      await expect(service.findByPhone('+1234567890')).rejects.toThrow(NotFoundException);
    });
  });
}); 