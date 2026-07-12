import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { TransactionPresenter } from './transaction.presenter';

const tx: Transaction = {
  id: 'uuid-1',
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
  customer: { email: 'k@e.com', fullName: 'K' },
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
  createdAt: new Date('2026-07-10T00:00:00Z'),
  updatedAt: new Date('2026-07-10T00:00:05Z'),
};

describe('TransactionPresenter', () => {
  it('toCreateResponse mapea estado a la app y fecha ISO', () => {
    const res = TransactionPresenter.toCreateResponse(tx);

    expect(res).toEqual({
      reference: 'YUGEN-1',
      id: 'uuid-1',
      gatewayTransactionId: 'gw_1',
      status: 'approved',
      amountCop: 712600,
      breakdown: tx.breakdown,
      cardBrand: 'VISA',
      cardLast4: '4242',
      createdAt: '2026-07-10T00:00:00.000Z',
    });
  });

  it('toDetailResponse agrega itemCount, items y updatedAt', () => {
    const res = TransactionPresenter.toDetailResponse(tx);

    expect(res.itemCount).toBe(2);
    expect(res.items).toEqual([
      { productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 2 },
    ]);
    expect(res.updatedAt).toBe('2026-07-10T00:00:05.000Z');
  });
});
