import { NotFoundException } from '@nestjs/common';
import { Transaction, TransactionStatus } from '../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../domain/repository/transaction.repository';
import { GetTransactionUseCase } from './get-transaction.usecase';

describe('GetTransactionUseCase', () => {
  const transaction = {
    id: 'uuid-1',
    reference: 'YUGEN-1-abcd',
    status: TransactionStatus.Approved,
  } as Transaction;

  const repo: jest.Mocked<TransactionRepositoryPort> = {
    create: jest.fn(),
    findByReference: jest.fn(),
    findByCustomerEmail: jest.fn(),
    updateStatus: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('devuelve la transaccion cuando existe', async () => {
    repo.findByReference.mockResolvedValue(transaction);
    const useCase = new GetTransactionUseCase(repo);

    await expect(useCase.execute('YUGEN-1-abcd')).resolves.toEqual(transaction);
  });

  it('lanza NotFoundException cuando no existe', async () => {
    repo.findByReference.mockResolvedValue(null);
    const useCase = new GetTransactionUseCase(repo);

    await expect(useCase.execute('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
