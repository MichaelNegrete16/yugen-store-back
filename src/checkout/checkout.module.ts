import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { PricingModule } from '../shared/pricing/pricing.module';
import { QuoteUseCase } from './application/quote.use-case';
import { CheckoutController } from './infrastructure/checkout.controller';

@Module({
  imports: [ProductsModule, PricingModule],
  controllers: [CheckoutController],
  providers: [QuoteUseCase],
})
export class CheckoutModule {}
