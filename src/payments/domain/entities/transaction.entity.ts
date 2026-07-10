import { PriceBreakdown } from '../../../shared/pricing/price-breakdown';

export enum TransactionStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Declined = 'DECLINED',
  Error = 'ERROR',
}

export type AppTransactionStatus = 'approved' | 'pending' | 'declined';

export function toAppStatus(status: TransactionStatus): AppTransactionStatus {
  switch (status) {
    case TransactionStatus.Approved:
      return 'approved';
    case TransactionStatus.Pending:
      return 'pending';
    default:
      return 'declined';
  }
}

export interface Customer {
  email: string;
  fullName: string;
  phone?: string | null;
}

export interface Delivery {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface TransactionItem {
  productId: string;
  name: string;
  unitPriceCop: number;
  qty: number;
}

export interface Transaction {
  id: string;
  reference: string;
  status: TransactionStatus;
  amountCop: number;
  breakdown: PriceBreakdown;
  currency: string;
  cardBrand: string;
  cardLast4: string;
  gatewayTransactionId?: string | null;
  customer: Customer;
  delivery: Delivery;
  items: TransactionItem[];
  createdAt: Date;
  updatedAt: Date;
}
