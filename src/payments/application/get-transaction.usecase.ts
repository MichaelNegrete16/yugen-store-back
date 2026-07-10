import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../products/domain/repository/product.repository';
import type { ProductRepository } from '../../products/domain/repository/product.repository';
import { fromGatewayStatus } from '../domain/gateway-status';
import { PAYMENT_GATEWAY } from '../domain/repository/payment-gateway.repository';
import type { PaymentGateway } from '../domain/repository/payment-gateway.repository';
import {
  Transaction,
  TransactionStatus,
} from '../domain/entities/transaction.entity';
import { TRANSACTION_REPOSITORY } from '../domain/repository/transaction.repository';
import type { TransactionRepository } from '../domain/repository/transaction.repository';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGateway,
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  async execute(reference: string): Promise<Transaction> {
    const transaction = await this.transactions.findByReference(reference);
    if (!transaction) {
      throw new NotFoundException(`Transaccion no encontrada: ${reference}`);
    }

    if (
      transaction.status === TransactionStatus.Pending &&
      transaction.gatewayTransactionId
    ) {
      return this.refreshFromGateway(transaction);
    }

    return transaction;
  }

  // Si sigue pendiente, consulta el estado real en la pasarela; al pasar a
  // aprobada actualiza la BD y descuenta stock (una sola vez).
  private async refreshFromGateway(
    transaction: Transaction,
  ): Promise<Transaction> {
    const charge = await this.gateway.getCharge(
      transaction.gatewayTransactionId as string,
    );
    const status = fromGatewayStatus(charge.status);

    if (status === transaction.status) {
      return transaction;
    }

    await this.transactions.updateStatus(
      transaction.reference,
      status,
      transaction.gatewayTransactionId,
    );

    if (status === TransactionStatus.Approved) {
      for (const item of transaction.items) {
        await this.products.decreaseStock(item.productId, item.qty);
      }
    }

    return { ...transaction, status };
  }
}
