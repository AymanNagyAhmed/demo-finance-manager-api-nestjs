import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Query, 
  Delete, 
  Param, 
  UseGuards, 
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { QueryUserDto } from '@/modules/users/dto/query-user.dto';
import { UsersService } from '@/modules/users/users.service';
import { AdminManagerGuard } from '@/modules/users/guards/admin-manager.guard';
import { Roles } from '@/modules/users/decorators/roles.decorator';
import { Role } from '@/modules/users/enums/role.enum';
import { User } from '@/modules/users/schemas/user.schema';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated users',
    type: User,
    isArray: true,
  })
  async findAll(@Query() query: QueryUserDto): Promise<PaginatedResponse<User>> {
    return this.usersService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user by phone number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user information for the given phone number',
    type: User,
  })
  async findByPhone(@Query('phoneNumber') phoneNumber: string): Promise<User> {
    return this.usersService.findByPhone(phoneNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user information for the given ID',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AdminManagerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
} 