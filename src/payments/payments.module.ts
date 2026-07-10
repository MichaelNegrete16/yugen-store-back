import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { PricingModule } from '../shared/pricing/pricing.module';
import { GetTransactionUseCase } from './application/get-transaction.usecase';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { PAYMENT_GATEWAY } from './domain/repository/payment-gateway.repository';
import { TRANSACTION_REPOSITORY } from './domain/repository/transaction.repository';
import { StubPaymentGatewayAdapter } from './infrastructure/services/stub-payment-gateway.service';
import { CustomerOrmEntity } from './infrastructure/models/customer.model';
import { DeliveryOrmEntity } from './infrastructure/models/delivery.model';
import { TransactionItemOrmEntity } from './infrastructure/models/transaction-item.model';
import { TransactionOrmEntity } from './infrastructure/models/transaction.model';
import { TypeOrmTransactionRepository } from './infrastructure/services/typeorm-transaction.service';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionOrmEntity,
      TransactionItemOrmEntity,
      CustomerOrmEntity,
      DeliveryOrmEntity,
    ]),
    ProductsModule,
    PricingModule,
  ],
  controllers: [TransactionsController],
  providers: [
    ProcessPaymentUseCase,
    GetTransactionUseCase,
    { provide: TRANSACTION_REPOSITORY, useClass: TypeOrmTransactionRepository },
    { provide: PAYMENT_GATEWAY, useClass: StubPaymentGatewayAdapter },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class PaymentsModule {}
