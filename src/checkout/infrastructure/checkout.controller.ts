import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PriceBreakdown } from '../../shared/pricing/price-breakdown';
import { QuoteUseCase } from '../application/quote.use-case';
import { QuoteRequestDto } from './dto/quote-request.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly quote: QuoteUseCase) {}

  @Post('quote')
  @HttpCode(HttpStatus.OK)
  quoteOrder(@Body() dto: QuoteRequestDto): Promise<PriceBreakdown> {
    return this.quote.execute(dto.items, dto.discountCode);
  }
}
