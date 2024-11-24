import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  @Matches(/^[a-zA-Z0-9\s\-_.]+$/, {
    message: 'Title can only contain letters, numbers, spaces, and basic punctuation',
  })
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post...',
    description: 'The content of the post',
    minLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @Transform(({ value }) => value.trim())
  content: string;
}
