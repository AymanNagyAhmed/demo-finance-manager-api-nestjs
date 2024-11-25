import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    example: 'Updated Post Title',
    description: 'The updated title of the post',
    required: false,
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z0-9\s\-_.]+$/, {
    message: 'Title can only contain letters, numbers, spaces, and basic punctuation',
  })
  title?: string;

  @ApiProperty({
    example: 'Updated content...',
    description: 'The updated content of the post',
    required: false,
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @Transform(({ value }) => value?.trim())
  content?: string;
}
