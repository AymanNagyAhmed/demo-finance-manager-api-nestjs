import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Query, 
  Delete, 
  Param, 
  UseGuards, 
  ParseIntPipe,
  HttpStatus,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';
import { AdminManagerGuard } from '@/modules/users/guards/admin-manager.guard';
import { Roles } from '@/modules/users/decorators/roles.decorator';
import { Role } from '@/modules/users/enums/role.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user by phone number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user information for the given phone number',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async findByPhone(@Query() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.findByPhone(createUserDto.phoneNumber);
    } catch (error) {
      this.logger.error(`Failed to find user by phone: ${error.message}`, error.stack);
      
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to search user');
    }
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ID value.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. User must be an admin or manager.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async deleteUser(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`, error.stack);
      
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
} 