export enum ProductCategory {
  Tea = 'tea',
  Food = 'food',
  Gaming = 'gaming',
  Decor = 'decor',
  Gifts = 'gifts',
}

/**
 * Modelo de dominio de un producto del catalogo. Es agnostico a la
 * persistencia: no conoce TypeORM ni la base de datos.
 */
export interface Product {
  id: string;
  name: string;
  priceCop: number;
  category: ProductCategory;
  image: string;
  rating: number;
  stock: number;
  badge?: string | null;
  description?: string | null;
  artisan?: string | null;
}
