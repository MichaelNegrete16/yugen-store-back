import { Controller, Get, Param } from '@nestjs/common';
import { Product } from '../domain/product';
import { GetProductUseCase } from '../application/get-product.use-case';
import { ListProductsUseCase } from '../application/list-products.use-case';

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
