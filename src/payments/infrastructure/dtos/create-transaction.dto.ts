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
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ShippingDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsString()
  @MinLength(1)
  city: string;

  @IsString()
  @MinLength(1)
  postalCode: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class TransactionItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  qty: number;
}

export class CardDto {
  @Matches(/^\d{13,19}$/, { message: 'number debe tener entre 13 y 19 digitos' })
  number: string;

  @IsString()
  @MinLength(1)
  cardHolder: string;

  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'expMonth debe ser 01-12' })
  expMonth: string;

  @Matches(/^\d{2}$/, { message: 'expYear debe tener 2 digitos' })
  expYear: string;

  @Matches(/^\d{3,4}$/, { message: 'cvc debe tener 3 o 4 digitos' })
  cvc: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  installments?: number;
}

export class CreateTransactionDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => ShippingDto)
  shipping: ShippingDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @IsOptional()
  @IsString()
  discountCode?: string;

  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsOptional()
  @IsString()
  acceptanceToken?: string;
}
