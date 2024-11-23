import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '@/common/dto/page-options.dto';

@Injectable()
export class BaseQueryService {
  protected applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    pageOptions: PageOptionsDto,
  ): SelectQueryBuilder<T> {
    return queryBuilder
      .skip(pageOptions.skip)
      .take(pageOptions.take);
  }

  protected applySorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    sortBy: string,
    order: string,
    alias: string,
    allowedSortFields: string[],
  ): SelectQueryBuilder<T> {
    if (sortBy && allowedSortFields.includes(sortBy)) {
      queryBuilder.orderBy(`${alias}.${sortBy}`, order as 'ASC' | 'DESC');
    }
    return queryBuilder;
  }

  protected applySearch<T>(
    queryBuilder: SelectQueryBuilder<T>,
    searchTerm: string,
    searchFields: { field: string; alias: string }[],
  ): SelectQueryBuilder<T> {
    if (searchTerm) {
      const searchConditions = searchFields.map(({ field, alias }) =>
        `${alias}.${field} LIKE :searchTerm`,
      );
      
      queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
        searchTerm: `%${searchTerm}%`,
      });
    }
    return queryBuilder;
  }
} 