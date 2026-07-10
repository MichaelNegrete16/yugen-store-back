import { Product } from '../domain/product';
import { ProductOrmEntity } from './product.orm-entity';

/** Traduce entre la entidad de persistencia y el modelo de dominio. */
export class ProductMapper {
  static toDomain(entity: ProductOrmEntity): Product {
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

  static toOrm(product: Product): ProductOrmEntity {
    const entity = new ProductOrmEntity();
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
