import { Product } from '../../domain/entities/product.entity';
import { ProductModel } from '../models/product.model';

/** Traduce entre la entidad de persistencia y el modelo de dominio. */
export class ProductMapper {
  static toDomain(entity: ProductModel): Product {
    return {
      id: entity.id,
      name: entity.name,
      priceCop: entity.priceCop,
      category: entity.category,
      image: entity.image,
      rating: entity.rating,
      stock: entity.stock,
      badge: entity.badge,
      description: entity.description,
      artisan: entity.artisan,
    };
  }

  static toOrm(product: Product): ProductModel {
    const entity = new ProductModel();
    entity.id = product.id;
    entity.name = product.name;
    entity.priceCop = product.priceCop;
    entity.category = product.category;
    entity.image = product.image;
    entity.rating = product.rating;
    entity.stock = product.stock;
    entity.badge = product.badge ?? null;
    entity.description = product.description ?? null;
    entity.artisan = product.artisan ?? null;
    return entity;
  }
}
