import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';

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
} 