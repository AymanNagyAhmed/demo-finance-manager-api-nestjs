import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryUserDto {
  @ApiPropertyOptional({ description: 'Search term for name or email' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Phone number to search' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ 
    enum: ['name', 'email', 'createdAt'],
    default: 'createdAt',
    description: 'Field to sort by' 
  })
  @IsOptional()
  @IsEnum(['name', 'email', 'createdAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    enum: SortOrder,
    default: SortOrder.DESC,
    description: 'Sort order (ASC or DESC)' 
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Page number' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    minimum: 1, 
    maximum: 100, 
    default: 10,
    description: 'Number of items per page' 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
} 