import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../domain/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../domain/repository/product.repository';
import type { ProductRepository } from '../domain/repository/product.repository';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  execute(): Promise<Product[]> {
    return this.products.findAll();
  }
}
