import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../domain/product';
import { PRODUCT_REPOSITORY } from '../domain/product.repository.port';
import type { ProductRepositoryPort } from '../domain/product.repository.port';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepositoryPort,
  ) {}

  execute(): Promise<Product[]> {
    return this.products.findAll();
  }
}
