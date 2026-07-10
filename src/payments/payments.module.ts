import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { PricingModule } from '../shared/pricing/pricing.module';
import { GetTransactionUseCase } from './application/get-transaction.usecase';
import { ListOrdersUseCase } from './application/list-orders.usecase';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { PAYMENT_GATEWAY } from './domain/repository/payment-gateway.repository';
import { TRANSACTION_REPOSITORY } from './domain/repository/transaction.repository';
import { PaymentGatewayService } from './infrastructure/services/payment-gateway.service';
import { CustomerModel } from './infrastructure/models/customer.model';
import { DeliveryModel } from './infrastructure/models/delivery.model';
import { TransactionItemModel } from './infrastructure/models/transaction-item.model';
import { TransactionModel } from './infrastructure/models/transaction.model';
import { TransactionService } from './infrastructure/services/transaction.service';
import { OrdersController } from './infrastructure/controllers/orders.controller';
import { TransactionsController } from './infrastructure/controllers/transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionModel,
      TransactionItemModel,
      CustomerModel,
      DeliveryModel,
    ]),
    ProductsModule,
    PricingModule,
  ],
  controllers: [TransactionsController, OrdersController],
  providers: [
    ProcessPaymentUseCase,
    GetTransactionUseCase,
    ListOrdersUseCase,
    { provide: TRANSACTION_REPOSITORY, useClass: TransactionService },
    { provide: PAYMENT_GATEWAY, useClass: PaymentGatewayService },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class PaymentsModule {}
