import {
  AppTransactionStatus,
  Transaction,
  toAppStatus,
} from '../../domain/entities/transaction.entity';

export interface OrderResponse {
  id: string;
  createdAt: string;
  amountCop: number;
  itemCount: number;
  productIds: string[];
  cardLast4: string;
  cardBrand: string;
  status: AppTransactionStatus;
}

export class OrderPresenter {
  static toResponse(tx: Transaction): OrderResponse {
    return {
      id: tx.reference,
      createdAt: tx.createdAt.toISOString(),
      amountCop: tx.amountCop,
      itemCount: tx.items.reduce((sum, item) => sum + item.qty, 0),
      productIds: [...new Set(tx.items.map((item) => item.productId))],
      cardLast4: tx.cardLast4,
      cardBrand: tx.cardBrand,
      status: toAppStatus(tx.status),
    };
  }

  static toList(transactions: Transaction[]): OrderResponse[] {
    return transactions.map((tx) => this.toResponse(tx));
  }
}
