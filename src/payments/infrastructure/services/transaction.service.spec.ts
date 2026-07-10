import { Repository } from 'typeorm';
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { NewTransaction } from '../../domain/repository/transaction.repository';
import { CustomerModel } from '../models/customer.model';
import { TransactionModel } from '../models/transaction.model';
import { TransactionService } from './transaction.service';

function newTransaction(): NewTransaction {
  return {
    reference: 'YUGEN-1',
    status: TransactionStatus.Approved,
    amountCop: 712600,
    breakdown: {
      subtotal: 640000,
      shipping: 15000,
      tax: 121600,
      discount: 64000,
      total: 712600,
    },
    currency: 'COP',
    cardBrand: 'VISA',
    cardLast4: '4242',
    gatewayTransactionId: 'gw_1',
    customer: { email: 'k@e.com', fullName: 'Kenji', phone: null },
    delivery: {
      firstName: 'K',
      lastName: 'S',
      address: 'a',
      city: 'b',
      postalCode: '1',
      country: 'Colombia',
    },
    items: [
      { productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 2 },
    ],
  };
}

describe('TransactionService', () => {
  let transactions: jest.Mocked<Repository<TransactionModel>>;
  let customers: jest.Mocked<Repository<CustomerModel>>;
  let service: TransactionService;

  beforeEach(() => {
    transactions = {
      create: jest.fn((e) => e),
      save: jest.fn((e) =>
        Promise.resolve({
          ...e,
          id: 'uuid-1',
          createdAt: new Date('2026-07-10T00:00:00Z'),
          updatedAt: new Date('2026-07-10T00:00:00Z'),
        }),
      ),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<TransactionModel>>;
    customers = {
      findOne: jest.fn(),
      create: jest.fn((c) => c),
      save: jest.fn((c) => Promise.resolve({ id: 'c1', ...c })),
    } as unknown as jest.Mocked<Repository<CustomerModel>>;
    service = new TransactionService(transactions, customers);
  });

  it('crea la transaccion con un cliente nuevo', async () => {
    customers.findOne.mockResolvedValue(null);

    const result = await service.create(newTransaction());

    expect(customers.create).toHaveBeenCalled();
    expect(result.reference).toBe('YUGEN-1');
    expect(result.amountCop).toBe(712600);
    expect(result.items).toHaveLength(1);
  });

  it('reutiliza el cliente existente por email', async () => {
    customers.findOne.mockResolvedValue({
      id: 'c1',
      email: 'k@e.com',
      fullName: 'viejo',
      phone: null,
    } as CustomerModel);

    await service.create(newTransaction());

    expect(customers.create).not.toHaveBeenCalled();
    expect(customers.save).toHaveBeenCalled();
  });

  it('findByReference devuelve null cuando no existe', async () => {
    transactions.findOne.mockResolvedValue(null);
    await expect(service.findByReference('nope')).resolves.toBeNull();
  });

  it('findByCustomerEmail consulta ordenado por fecha desc', async () => {
    transactions.find.mockResolvedValue([]);
    await service.findByCustomerEmail('k@e.com');
    expect(transactions.find).toHaveBeenCalledWith({
      where: { customer: { email: 'k@e.com' } },
      order: { createdAt: 'DESC' },
    });
  });

  it('updateStatus actualiza estado y gatewayTransactionId', async () => {
    await service.updateStatus('YUGEN-1', TransactionStatus.Approved, 'gw_9');
    expect(transactions.update).toHaveBeenCalledWith(
      { reference: 'YUGEN-1' },
      { status: TransactionStatus.Approved, gatewayTransactionId: 'gw_9' },
    );
  });
});
