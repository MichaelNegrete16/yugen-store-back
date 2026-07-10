import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../domain/transaction';
import { TRANSACTION_REPOSITORY } from '../domain/transaction.repository.port';
import type { TransactionRepositoryPort } from '../domain/transaction.repository.port';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepositoryPort,
  ) {}

  async execute(reference: string): Promise<Transaction> {
    const transaction = await this.transactions.findByReference(reference);
    if (!transaction) {
      throw new NotFoundException(`Transaccion no encontrada: ${reference}`);
    }
    return transaction;
  }
}
