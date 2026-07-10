import { ApiProperty } from '@nestjs/swagger';

export class PriceBreakdownResponse {
  @ApiProperty({ example: 640000 })
  subtotal: number;

  @ApiProperty({ example: 15000 })
  shipping: number;

  @ApiProperty({ example: 121600, description: 'IVA 19%' })
  tax: number;

  @ApiProperty({ example: 64000 })
  discount: number;

  @ApiProperty({ example: 712600 })
  total: number;
}
