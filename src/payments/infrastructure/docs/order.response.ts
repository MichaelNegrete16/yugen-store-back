import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDoc {
  @ApiProperty({ example: 'YUGEN-1731020400000-a1b2', description: 'Referencia' })
  id: string;

  @ApiProperty({ example: '2026-07-10T05:48:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: 712600 })
  amountCop: number;

  @ApiProperty({ example: 2 })
  itemCount: number;

  @ApiProperty({ example: ['tea-set'], type: [String] })
  productIds: string[];

  @ApiProperty({ example: '4242' })
  cardLast4: string;

  @ApiProperty({ example: 'VISA' })
  cardBrand: string;

  @ApiProperty({ enum: ['approved', 'pending', 'declined'], example: 'approved' })
  status: string;
}
