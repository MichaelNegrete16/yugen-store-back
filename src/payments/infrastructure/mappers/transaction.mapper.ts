import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionModel } from '../models/transaction.model';

export class TransactionMapper {
  static toDomain(entity: TransactionModel): Transaction {
    return {
      id: entity.id,
      reference: entity.reference,
      status: entity.status,
      amountCop: entity.amountCop,
      breakdown: {
        subtotal: entity.subtotalCop,
        shipping: entity.shippingCop,
        tax: entity.taxCop,
        discount: entity.discountCop,
        total: entity.amountCop,
      },
      currency: entity.currency,
      cardBrand: entity.cardBrand,
      cardLast4: entity.cardLast4,
      gatewayTransactionId: entity.gatewayTransactionId,
      customer: {
        email: entity.customer.email,
        fullName: entity.customer.fullName,
        phone: entity.customer.phone,
      },
      delivery: {
        firstName: entity.delivery.firstName,
        lastName: entity.delivery.lastName,
        address: entity.delivery.address,
        city: entity.delivery.city,
        postalCode: entity.delivery.postalCode,
        country: entity.delivery.country,
      },
      items: (entity.items ?? []).map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPriceCop: item.unitPriceCop,
        qty: item.qty,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
