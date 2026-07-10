import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetTransactionUseCase } from '../../application/get-transaction.usecase';
import { ProcessPaymentUseCase } from '../../application/process-payment.usecase';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import {
  CreateTransactionResponse,
  TransactionDetailResponse,
  TransactionPresenter,
} from '../presenters/transaction.presenter';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly processPayment: ProcessPaymentUseCase,
    private readonly getTransaction: GetTransactionUseCase,
  ) {}

  @Post()
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
  async findOne(
    @Param('reference') reference: string,
  ): Promise<TransactionDetailResponse> {
    const transaction = await this.getTransaction.execute(reference);
    return TransactionPresenter.toDetailResponse(transaction);
  }
}
