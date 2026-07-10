import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../domain/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../domain/repository/product.repository';
import type { ProductRepositoryPort } from '../domain/repository/product.repository';

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
