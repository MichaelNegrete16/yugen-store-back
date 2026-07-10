import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProductUseCase } from './application/get-product.usecase';
import { ListProductsUseCase } from './application/list-products.usecase';
import { PRODUCT_REPOSITORY } from './domain/repository/product.repository';
import { ProductModel } from './infrastructure/models/product.model';
import { ProductSeeder } from './infrastructure/seeders/product.seeder';
import { ProductsController } from './infrastructure/controllers/products.controller';
import { ProductService } from './infrastructure/services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel])],
  controllers: [ProductsController],
  providers: [
    ListProductsUseCase,
    GetProductUseCase,
    ProductSeeder,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductService,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
