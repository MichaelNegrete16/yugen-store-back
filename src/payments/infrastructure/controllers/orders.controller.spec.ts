import { ListOrdersUseCase } from '../../application/list-orders.usecase';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  const listOrders = { execute: jest.fn() } as unknown as ListOrdersUseCase;
  const controller = new OrdersController(listOrders);

  it('findAll consulta por email y mapea al shape Order', async () => {
    const tx = {
      reference: 'YUGEN-1',
      status: TransactionStatus.Approved,
      amountCop: 100,
      cardBrand: 'VISA',
      cardLast4: '4242',
      items: [{ productId: 'tea-set', name: 'Té', unitPriceCop: 100, qty: 1 }],
      createdAt: new Date('2026-07-10T00:00:00Z'),
    } as Transaction;
    (listOrders.execute as jest.Mock).mockResolvedValue([tx]);

    const res = await controller.findAll({ email: 'k@e.com' });

    expect(listOrders.execute).toHaveBeenCalledWith('k@e.com');
    expect(res[0].id).toBe('YUGEN-1');
    expect(res[0].productIds).toEqual(['tea-set']);
  });
});
