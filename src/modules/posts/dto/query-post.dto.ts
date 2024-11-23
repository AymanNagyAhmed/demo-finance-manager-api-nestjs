import { IsOptional, IsString, IsEnum, IsInt, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortField {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class QueryPostDto {
  @ApiPropertyOptional({
    description: 'Search term for title and content',
    example: 'technology',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\-_.]+$/, {
    message: 'Search term can only contain letters, numbers, spaces, and basic punctuation',
  })
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid user ID format',
  })
  userId?: string;

  @ApiPropertyOptional({
    enum: SortField,
    default: SortField.CREATED_AT,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField = SortField.CREATED_AT;

  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.DESC,
    description: 'Sort direction',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;
} 