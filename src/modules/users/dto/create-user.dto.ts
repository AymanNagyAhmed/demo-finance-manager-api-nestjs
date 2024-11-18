import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPhone } from '@/common/decorators/is-phone.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number in international format',
  })
  @IsNotEmpty()
  @IsPhone({
    message: 'Please provide a valid phone number in international format',
  })
  @Transform(({ value }) => value?.replace(/[\s\-\(\)]/g, ''))
  phoneNumber: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;
} 