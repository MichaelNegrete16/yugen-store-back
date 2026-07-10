import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { PricingModule } from '../shared/pricing/pricing.module';
import { GetTransactionUseCase } from './application/get-transaction.use-case';
import { ProcessPaymentUseCase } from './application/process-payment.use-case';
import { PAYMENT_GATEWAY } from './domain/payment-gateway.port';
import { TRANSACTION_REPOSITORY } from './domain/transaction.repository.port';
import { StubPaymentGatewayAdapter } from './infrastructure/gateway/stub-payment-gateway.adapter';
import { CustomerOrmEntity } from './infrastructure/persistence/customer.orm-entity';
import { DeliveryOrmEntity } from './infrastructure/persistence/delivery.orm-entity';
import { TransactionItemOrmEntity } from './infrastructure/persistence/transaction-item.orm-entity';
import { TransactionOrmEntity } from './infrastructure/persistence/transaction.orm-entity';
import { TypeOrmTransactionRepository } from './infrastructure/persistence/typeorm-transaction.repository';
import { TransactionsController } from './infrastructure/transactions.controller';

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
