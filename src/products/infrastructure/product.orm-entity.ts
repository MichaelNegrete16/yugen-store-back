import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ProductCategory } from '../domain/product';

/**
 * Representacion en base de datos del producto. Vive en infraestructura para
 * mantener el dominio libre de dependencias de TypeORM.
 */
@Entity({ name: 'products' })
export class ProductOrmEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  priceCop: number;

  @Column({ type: 'varchar' })
  category: ProductCategory;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', nullable: true })
  badge: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  artisan: string | null;
}
