import { ApiProperty } from '@nestjs/swagger';
import { PriceBreakdownResponse } from '../../../shared/pricing/price-breakdown.response';

export class TransactionItemResponse {
  @ApiProperty({ example: 'tea-set' })
  productId: string;

  @ApiProperty({ example: 'Juego de Té de Basalto' })
  name: string;

  @ApiProperty({ example: 320000 })
  unitPriceCop: number;

  @ApiProperty({ example: 2 })
  qty: number;
}

export class CreateTransactionResponseDoc {
  @ApiProperty({ example: 'YUGEN-1731020400000-a1b2' })
  reference: string;

  @ApiProperty({ example: '9c1e...uuid' })
  id: string;

  @ApiProperty({
    example: '113809-1731020400-00001',
    nullable: true,
    description: 'Referencia de la transacción en la pasarela de pago',
  })
  gatewayTransactionId: string | null;

  @ApiProperty({ enum: ['approved', 'pending', 'declined'], example: 'pending' })
  status: string;

  @ApiProperty({ example: 712600 })
  amountCop: number;

  @ApiProperty({ type: PriceBreakdownResponse })
  breakdown: PriceBreakdownResponse;

  @ApiProperty({ example: 'VISA' })
  cardBrand: string;

  @ApiProperty({ example: '4242' })
  cardLast4: string;

  @ApiProperty({ example: '2026-07-10T05:48:00.000Z' })
  createdAt: string;
}

export class TransactionDetailResponseDoc extends CreateTransactionResponseDoc {
  @ApiProperty({ example: 2 })
  itemCount: number;

  @ApiProperty({ type: TransactionItemResponse, isArray: true })
  items: TransactionItemResponse[];

  @ApiProperty({ example: '2026-07-10T05:48:07.000Z' })
  updatedAt: string;
}
