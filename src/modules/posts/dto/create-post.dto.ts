import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'This is the content of my first post...' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;
}
