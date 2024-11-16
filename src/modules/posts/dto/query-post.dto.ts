import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortField {
  ID = 'id',
  TITLE = 'title',
  CONTENT = 'content',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class QueryPostDto {
  @ApiPropertyOptional({ example: 'search term' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  searchId?: number;

  @ApiPropertyOptional({ example: '2024-03-20T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  searchDate?: string;

  @ApiPropertyOptional({ 
    enum: SortField, 
    default: SortField.CREATED_AT,
    description: 'Field to sort by'
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField = SortField.CREATED_AT;

  @ApiPropertyOptional({ 
    enum: SortOrder, 
    default: SortOrder.DESC,
    description: 'Sort direction'
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
} 