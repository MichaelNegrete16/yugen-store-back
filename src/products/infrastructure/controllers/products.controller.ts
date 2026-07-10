import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Product } from '../../domain/entities/product.entity';
import { GetProductUseCase } from '../../application/get-product.usecase';
import { ListProductsUseCase } from '../../application/list-products.usecase';
import { ProductResponse } from '../docs/product.response';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista el catálogo de productos' })
  @ApiOkResponse({ type: ProductResponse, isArray: true })
  findAll(): Promise<Product[]> {
    return this.listProducts.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un producto por su id' })
  @ApiParam({ name: 'id', example: 'tea-set' })
  @ApiOkResponse({ type: ProductResponse })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.getProduct.execute(id);
  }
}
