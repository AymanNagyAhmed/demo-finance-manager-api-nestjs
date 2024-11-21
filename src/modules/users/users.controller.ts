import { Controller, Post, Body, Get, Query, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';
import { AdminManagerGuard } from '@/modules/users/guards/admin-manager.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search user by phone number' })
  @ApiResponse({
    status: 200,
    description: 'Returns user information for the given phone number',
  })
  async findByPhone(@Query() createUserDto: CreateUserDto) {
    return this.usersService.findByPhone(createUserDto.phoneNumber);
  }

  @Delete(':id')
  @UseGuards(AdminManagerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User must be an admin or manager.',
  })
  async deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
} 