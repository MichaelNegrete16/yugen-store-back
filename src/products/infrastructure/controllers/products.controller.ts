import { Controller, Get, Param } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { GetProductUseCase } from '../../application/get-product.usecase';
import { ListProductsUseCase } from '../../application/list-products.usecase';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.listProducts.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.getProduct.execute(id);
  }
}
