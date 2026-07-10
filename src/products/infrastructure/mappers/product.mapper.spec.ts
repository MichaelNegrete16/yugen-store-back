import { ProductCategory } from '../../domain/entities/product.entity';
import { ProductModel } from '../models/product.model';
import { ProductMapper } from './product.mapper';

describe('ProductMapper', () => {
  const entity: ProductModel = {
    id: 'tea-set',
    name: 'Juego de Té',
    priceCop: 320000,
    category: ProductCategory.Tea,
    image: 'https://x/tea.jpg',
    rating: 4.9,
    stock: 8,
    badge: 'Nuevo',
    description: 'desc',
    artisan: 'Kenzo',
  };

  it('toDomain traduce la entidad a modelo de dominio', () => {
    expect(ProductMapper.toDomain(entity)).toEqual(entity);
  });

  it('toOrm traduce el dominio a entidad y normaliza opcionales', () => {
    const orm = ProductMapper.toOrm({
      id: 'x',
      name: 'X',
      priceCop: 1000,
      category: ProductCategory.Gifts,
      image: 'https://x/x.jpg',
      rating: 5,
      stock: 2,
    });

    expect(orm.badge).toBeNull();
    expect(orm.description).toBeNull();
    expect(orm.artisan).toBeNull();
    expect(orm.priceCop).toBe(1000);
  });
});
