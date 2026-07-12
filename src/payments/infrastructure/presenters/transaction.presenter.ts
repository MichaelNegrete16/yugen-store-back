import { PriceBreakdown } from '../../../shared/pricing/price-breakdown';
import {
  AppTransactionStatus,
  Transaction,
  toAppStatus,
} from '../../domain/entities/transaction.entity';

export interface CreateTransactionResponse {
  reference: string;
  id: string;
  /** Referencia de la transacción en la pasarela de pago (null si no aplica). */
  gatewayTransactionId: string | null;
  status: AppTransactionStatus;
  amountCop: number;
  breakdown: PriceBreakdown;
  cardBrand: string;
  cardLast4: string;
  createdAt: string;
}

export interface TransactionDetailResponse extends CreateTransactionResponse {
  itemCount: number;
  items: {
    productId: string;
    name: string;
    unitPriceCop: number;
    qty: number;
  }[];
  updatedAt: string;
}

export class TransactionPresenter {
  static toCreateResponse(tx: Transaction): CreateTransactionResponse {
    return {
      reference: tx.reference,
      id: tx.id,
      gatewayTransactionId: tx.gatewayTransactionId ?? null,
      status: toAppStatus(tx.status),
      amountCop: tx.amountCop,
      breakdown: tx.breakdown,
      cardBrand: tx.cardBrand,
      cardLast4: tx.cardLast4,
      createdAt: tx.createdAt.toISOString(),
    };
  }

  static toDetailResponse(tx: Transaction): TransactionDetailResponse {
    return {
      ...this.toCreateResponse(tx),
      itemCount: tx.items.reduce((sum, item) => sum + item.qty, 0),
      items: tx.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPriceCop: item.unitPriceCop,
        qty: item.qty,
      })),
      updatedAt: tx.updatedAt.toISOString(),
    };
  }
}
