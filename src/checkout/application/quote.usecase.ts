import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../products/domain/repository/product.repository';
import type { ProductRepository } from '../../products/domain/repository/product.repository';
import { PRICING_CONFIG } from '../../shared/pricing/pricing.module';
import {
  PriceBreakdown,
  PricedLine,
  calculatePriceBreakdown,
} from '../../shared/pricing/price-breakdown';
import type { PricingConfig } from '../../shared/pricing/price-breakdown';

export interface QuoteItem {
  productId: string;
  qty: number;
}

/**
 * Cotiza un pedido: resuelve el precio de cada producto (fuente de verdad del
 * backend) y calcula el desglose. Nunca confia en un total enviado por el
 * cliente.
 */
@Injectable()
export class QuoteUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(PRICING_CONFIG)
    private readonly pricing: PricingConfig,
  ) {}

  async execute(
    items: QuoteItem[],
    discountCode?: string,
  ): Promise<PriceBreakdown> {
    const lines: PricedLine[] = [];

    for (const item of items) {
      const product = await this.products.findById(item.productId);
      if (!product) {
        throw new NotFoundException(
          `Producto no encontrado: ${item.productId}`,
        );
      }
      lines.push({ unitPriceCop: product.priceCop, qty: item.qty });
    }

    return calculatePriceBreakdown(lines, discountCode, this.pricing);
  }
}
