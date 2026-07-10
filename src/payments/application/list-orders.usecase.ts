import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../domain/entities/transaction.entity';
import { TRANSACTION_REPOSITORY } from '../domain/repository/transaction.repository';
import type { TransactionRepository } from '../domain/repository/transaction.repository';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
  ) {}

  execute(email: string): Promise<Transaction[]> {
    return this.transactions.findByCustomerEmail(email);
  }
}
