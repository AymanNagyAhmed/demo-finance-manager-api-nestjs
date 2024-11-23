import { Repository, FindOptionsWhere } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

// Interface for entities with ID
interface IEntityWithId {
  id: number;
}

// Extend Repository with a constraint that T must have an id property
export class BaseRepository<T extends IEntityWithId> extends Repository<T> {
  async findOneByIdOrFail(id: number): Promise<T> {
    const entity = await this.findOne({
      where: { id } as FindOptionsWhere<T>,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }
} 