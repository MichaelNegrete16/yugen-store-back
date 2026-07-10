import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { TransactionModel } from '../models/transaction.model';
import { TransactionMapper } from './transaction.mapper';

function buildEntity(overrides: Partial<TransactionModel> = {}): TransactionModel {
  return {
    id: 'uuid-1',
    reference: 'YUGEN-1',
    status: TransactionStatus.Approved,
    amountCop: 712600,
    subtotalCop: 640000,
    shippingCop: 15000,
    taxCop: 121600,
    discountCop: 64000,
    currency: 'COP',
    cardBrand: 'VISA',
    cardLast4: '4242',
    gatewayTransactionId: 'gw_1',
    customer: { id: 'c1', email: 'k@e.com', fullName: 'K', phone: null },
    delivery: {
      id: 'd1',
      firstName: 'K',
      lastName: 'S',
      address: 'a',
      city: 'b',
      postalCode: '1',
      country: 'Colombia',
    },
    items: [
      { id: 'i1', productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 2 },
    ],
    createdAt: new Date('2026-07-10T00:00:00Z'),
    updatedAt: new Date('2026-07-10T00:00:00Z'),
    ...overrides,
  } as TransactionModel;
}

describe('TransactionMapper', () => {
  it('reconstruye el breakdown y las relaciones', () => {
    const domain = TransactionMapper.toDomain(buildEntity());

    expect(domain.breakdown).toEqual({
      subtotal: 640000,
      shipping: 15000,
      tax: 121600,
      discount: 64000,
      total: 712600,
    });
    expect(domain.customer.email).toBe('k@e.com');
    expect(domain.delivery.city).toBe('b');
    expect(domain.items).toHaveLength(1);
    expect(domain.items[0]).toEqual({
      productId: 'tea-set',
      name: 'Té',
      unitPriceCop: 320000,
      qty: 2,
    });
  });

  it('tolera items ausentes', () => {
    const domain = TransactionMapper.toDomain(
      buildEntity({ items: undefined as unknown as TransactionModel['items'] }),
    );
    expect(domain.items).toEqual([]);
  });
});
