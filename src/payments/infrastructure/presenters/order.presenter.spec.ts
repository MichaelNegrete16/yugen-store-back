import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { OrderPresenter } from './order.presenter';

const tx = {
  reference: 'YUGEN-1',
  status: TransactionStatus.Approved,
  amountCop: 712600,
  cardBrand: 'VISA',
  cardLast4: '4242',
  items: [
    { productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 2 },
    { productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 1 },
    { productId: 'matcha-set', name: 'Matcha', unitPriceCop: 340000, qty: 1 },
  ],
  createdAt: new Date('2026-07-10T00:00:00Z'),
} as Transaction;

describe('OrderPresenter', () => {
  it('mapea al shape Order con productIds unicos e itemCount', () => {
    const res = OrderPresenter.toResponse(tx);

    expect(res).toEqual({
      id: 'YUGEN-1',
      createdAt: '2026-07-10T00:00:00.000Z',
      amountCop: 712600,
      itemCount: 4,
      productIds: ['tea-set', 'matcha-set'],
      cardLast4: '4242',
      cardBrand: 'VISA',
      status: 'approved',
    });
  });

  it('toList mapea toda la coleccion', () => {
    expect(OrderPresenter.toList([tx])).toHaveLength(1);
  });
});
