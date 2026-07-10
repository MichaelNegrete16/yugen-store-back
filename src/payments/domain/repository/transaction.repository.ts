import { Transaction } from '../entities/transaction.entity';

export type NewTransaction = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt'
>;

export interface TransactionRepositoryPort {
  create(data: NewTransaction): Promise<Transaction>;
  findByReference(reference: string): Promise<Transaction | null>;
  findByCustomerEmail(email: string): Promise<Transaction[]>;
  updateStatus(
    reference: string,
    status: Transaction['status'],
    gatewayTransactionId?: string | null,
  ): Promise<void>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');
