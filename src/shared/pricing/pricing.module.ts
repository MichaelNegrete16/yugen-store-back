import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PricingConfig } from './price-breakdown';

/** Token de inyeccion para la configuracion de precios. */
export const PRICING_CONFIG = Symbol('PRICING_CONFIG');

/**
 * Expone `PRICING_CONFIG` (parametros de negocio ya convertidos a numero) para
 * que los casos de uso calculen precios sin depender de ConfigService.
 */
@Module({
  providers: [
    {
      provide: PRICING_CONFIG,
      inject: [ConfigService],
      useFactory: (config: ConfigService): PricingConfig => ({
        shippingCop: Number(config.get('SHIPPING_COP')),
        ivaRate: Number(config.get('IVA_RATE')),
        discountCode: String(config.get('DISCOUNT_CODE')),
        discountRate: Number(config.get('DISCOUNT_RATE')),
      }),
    },
  ],
  exports: [PRICING_CONFIG],
})
export class PricingModule {}
