import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { PriceBreakdown } from '../../../shared/pricing/price-breakdown';
import { PriceBreakdownResponse } from '../../../shared/pricing/price-breakdown.response';
import { QuoteUseCase } from '../../application/quote.usecase';
import { QuoteRequestDto } from '../dtos/quote-request.dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly quote: QuoteUseCase) {}

  @Post('quote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cotiza un pedido',
    description:
      'Recalcula subtotal, envío, IVA (19%) y descuento (YUGEN10) desde el ' +
      'catálogo. El backend es la fuente de verdad; nunca confía en un total del cliente.',
  })
  @ApiOkResponse({ type: PriceBreakdownResponse })
  @ApiUnprocessableEntityResponse({ description: 'Validación o producto inexistente' })
  quoteOrder(@Body() dto: QuoteRequestDto): Promise<PriceBreakdown> {
    return this.quote.execute(dto.items, dto.discountCode);
  }
}
