import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GetTransactionUseCase } from '../../application/get-transaction.usecase';
import { ProcessPaymentUseCase } from '../../application/process-payment.usecase';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import {
  CreateTransactionResponseDoc,
  TransactionDetailResponseDoc,
} from '../docs/transaction.response';
import {
  CreateTransactionResponse,
  TransactionDetailResponse,
  TransactionPresenter,
} from '../presenters/transaction.presenter';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly processPayment: ProcessPaymentUseCase,
    private readonly getTransaction: GetTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crea el pago con tarjeta',
    description:
      'Valida stock, recalcula el total, tokeniza la tarjeta (no la persiste), ' +
      'crea el cargo en la pasarela y devuelve la referencia y el estado.',
  })
  @ApiCreatedResponse({ type: CreateTransactionResponseDoc })
  @ApiUnprocessableEntityResponse({ description: 'Validación o sin stock' })
  async create(
    @Body() dto: CreateTransactionDto,
  ): Promise<CreateTransactionResponse> {
    const transaction = await this.processPayment.execute({
      customer: dto.customer,
      shipping: { ...dto.shipping, country: dto.shipping.country ?? 'Colombia' },
      items: dto.items,
      discountCode: dto.discountCode,
      card: {
        number: dto.card.number,
        cardHolder: dto.card.cardHolder,
        expMonth: dto.card.expMonth,
        expYear: dto.card.expYear,
        cvc: dto.card.cvc,
        installments: dto.card.installments ?? 1,
      },
      acceptanceToken: dto.acceptanceToken,
    });
    return TransactionPresenter.toCreateResponse(transaction);
  }

  @Get(':reference')
  @ApiOperation({
    summary: 'Consulta el estado de una transacción (polling)',
    description:
      'Si sigue pendiente, refresca el estado desde la pasarela y actualiza la BD.',
  })
  @ApiParam({ name: 'reference', example: 'YUGEN-1731020400000-a1b2' })
  @ApiOkResponse({ type: TransactionDetailResponseDoc })
  async findOne(
    @Param('reference') reference: string,
  ): Promise<TransactionDetailResponse> {
    const transaction = await this.getTransaction.execute(reference);
    return TransactionPresenter.toDetailResponse(transaction);
  }
}
