import { Transaction, TransactionStatus } from '../domain/entities/transaction.entity';
import { TransactionRepository } from '../domain/repository/transaction.repository';
import { ListOrdersUseCase } from './list-orders.usecase';

describe('ListOrdersUseCase', () => {
  const repo: jest.Mocked<TransactionRepository> = {
    create: jest.fn(),
    findByReference: jest.fn(),
    findByCustomerEmail: jest.fn(),
    updateStatus: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('devuelve las ordenes del cliente por email', async () => {
    const orders = [
      { reference: 'YUGEN-1', status: TransactionStatus.Approved },
    ] as Transaction[];
    repo.findByCustomerEmail.mockResolvedValue(orders);
    const useCase = new ListOrdersUseCase(repo);

    await expect(useCase.execute('kenji@example.com')).resolves.toBe(orders);
    expect(repo.findByCustomerEmail).toHaveBeenCalledWith('kenji@example.com');
  });
});
