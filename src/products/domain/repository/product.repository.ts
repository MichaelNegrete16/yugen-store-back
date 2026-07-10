import { Product } from '../entities/product.entity';

/**
 * Puerto de salida para acceder al catalogo. La capa de aplicacion depende de
 * esta abstraccion; el adaptador concreto (TypeORM) vive en infraestructura.
 */
export interface ProductRepositoryPort {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  /** Descuenta `qty` unidades del stock de un producto. */
  decreaseStock(id: string, qty: number): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
