import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CustomerDto {
  @ApiProperty({ example: 'kenji@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Kenji Sato' })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiPropertyOptional({ example: '+573001112233' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class ShippingDto {
  @ApiProperty({ example: 'Kenji' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Sato' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: 'Cra 7 45-10' })
  @IsString()
  @MinLength(1)
  address: string;

  @ApiProperty({ example: 'Bogotá' })
  @IsString()
  @MinLength(1)
  city: string;

  @ApiProperty({ example: '110111' })
  @IsString()
  @MinLength(1)
  postalCode: string;

  @ApiPropertyOptional({ example: 'Colombia', default: 'Colombia' })
  @IsOptional()
  @IsString()
  country?: string;
}

export class TransactionItemDto {
  @ApiProperty({ example: 'tea-set' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  qty: number;
}

export class CardDto {
  @ApiProperty({
    example: '4242424242424242',
    description: 'Tarjeta de prueba: 4242… aprueba, 4111… declina. No se persiste.',
  })
  @Matches(/^\d{13,19}$/, { message: 'number debe tener entre 13 y 19 digitos' })
  number: string;

  @ApiProperty({ example: 'KENJI SATO' })
  @IsString()
  @MinLength(1)
  cardHolder: string;

  @ApiProperty({ example: '12' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'expMonth debe ser 01-12' })
  expMonth: string;

  @ApiProperty({ example: '29' })
  @Matches(/^\d{2}$/, { message: 'expYear debe tener 2 digitos' })
  expYear: string;

  @ApiProperty({ example: '123' })
  @Matches(/^\d{3,4}$/, { message: 'cvc debe tener 3 o 4 digitos' })
  cvc: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;
}

export class CreateTransactionDto {
  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: ShippingDto })
  @ValidateNested()
  @Type(() => ShippingDto)
  shipping: ShippingDto;

  @ApiProperty({ type: TransactionItemDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @ApiPropertyOptional({ example: 'YUGEN10' })
  @IsOptional()
  @IsString()
  discountCode?: string;

  @ApiProperty({ type: CardDto })
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @ApiPropertyOptional({ description: 'Token de aceptación de la pasarela (opcional)' })
  @IsOptional()
  @IsString()
  acceptanceToken?: string;
}
