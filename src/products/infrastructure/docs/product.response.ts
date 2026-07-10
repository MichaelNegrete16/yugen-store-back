import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../../domain/entities/product.entity';

export class ProductResponse {
  @ApiProperty({ example: 'tea-set' })
  id: string;

  @ApiProperty({ example: 'Juego de Té de Basalto' })
  name: string;

  @ApiProperty({ example: 320000, description: 'Precio en COP (entero)' })
  priceCop: number;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.Tea })
  category: ProductCategory;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1563822249366' })
  image: string;

  @ApiProperty({ example: 4.9 })
  rating: number;

  @ApiProperty({ example: 8 })
  stock: number;

  @ApiProperty({ example: 'Nuevo', nullable: true, required: false })
  badge?: string | null;

  @ApiProperty({ example: 'Juego de té japonés en basalto mate negro.', nullable: true, required: false })
  description?: string | null;

  @ApiProperty({ example: 'Kenzo Tanaka', nullable: true, required: false })
  artisan?: string | null;
}
