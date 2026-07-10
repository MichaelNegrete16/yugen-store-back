import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../domain/product';
import { PRODUCT_REPOSITORY } from '../domain/product.repository.port';
import type { ProductRepositoryPort } from '../domain/product.repository.port';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.products.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto no encontrado: ${id}`);
    }
    return product;
  }
}
