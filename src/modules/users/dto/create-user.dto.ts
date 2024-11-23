import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhone } from '@/common/decorators/is-phone.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number in international format (e.g., +1234567890)',
  })
  @IsNotEmpty()
  @IsPhone()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must start with + and contain only numbers',
  })
  @Transform(({ value }) => value?.replace(/[\s\-\(\)]/g, ''))
  phoneNumber: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'The password of the user (min 8 chars)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;
} 