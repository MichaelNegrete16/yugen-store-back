import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/product';
import { ProductRepositoryPort } from '../domain/product.repository.port';
import { ProductMapper } from './product.mapper';
import { ProductOrmEntity } from './product.orm-entity';

/** Adaptador TypeORM que implementa el puerto del catalogo. */
@Injectable()
export class TypeOrmProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repo.find({ order: { name: 'ASC' } });
    return entities.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async decreaseStock(id: string, qty: number): Promise<void> {
    await this.repo.decrement({ id }, 'stock', qty);
  }
}
