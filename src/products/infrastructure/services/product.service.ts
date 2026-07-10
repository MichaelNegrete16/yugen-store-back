import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repository/product.repository';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductModel } from '../models/product.model';

/** Adaptador TypeORM que implementa el puerto del catalogo. */
@Injectable()
export class ProductService implements ProductRepository {
  constructor(
    @InjectRepository(ProductModel)
    private readonly repo: Repository<ProductModel>,
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
