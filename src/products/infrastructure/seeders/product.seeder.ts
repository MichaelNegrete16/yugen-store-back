import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../../domain/entities/product.entity';
import { ProductModel } from '../models/product.model';

/** Catalogo inicial (mismos datos del mock de la app). */
const SEED_PRODUCTS: ProductModel[] = [
  {
    id: 'tea-set',
    name: 'Juego de Té de Basalto',
    priceCop: 320000,
    category: ProductCategory.Tea,
    image: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9',
    rating: 4.9,
    stock: 8,
    badge: 'Nuevo',
    description:
      'Juego de té japonés en basalto mate negro, hecho a mano. Sobria elegancia para el ritual diario.',
    artisan: 'Kenzo Tanaka',
  },
  {
    id: 'writing-set',
    name: 'Set de Escritura en Ebonita',
    priceCop: 245000,
    category: ProductCategory.Gifts,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
    rating: 5.0,
    stock: 5,
    badge: null,
    description:
      'Pluma de ebonita pulida con plumín dorado sobre cuaderno de papel Washi. Lujo minimalista para escribir.',
    artisan: 'Hiroshi Abe',
  },
  {
    id: 'matcha-set',
    name: 'Set Ritual de Matcha Kuroi',
    priceCop: 340000,
    category: ProductCategory.Tea,
    image: 'https://images.unsplash.com/photo-1536013455962-4dc3b8f0f3a9',
    rating: 5.0,
    stock: 3,
    badge: 'Edición Limitada',
    description:
      'Incluye 40g de Matcha de Uji grado ceremonial, de granjas familiares sostenibles.',
    artisan: 'Takuya Matsuo',
  },
];

/**
 * Carga el catalogo inicial al arrancar si la tabla esta vacia. Es idempotente:
 * no duplica productos en reinicios.
 */
@Injectable()
export class ProductSeeder implements OnModuleInit {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(
    @InjectRepository(ProductModel)
    private readonly repo: Repository<ProductModel>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.repo.count();
    if (count > 0) {
      return;
    }
    await this.repo.save(SEED_PRODUCTS);
    this.logger.log(`Catalogo inicial cargado: ${SEED_PRODUCTS.length} productos`);
  }
}
