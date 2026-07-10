import { GetTransactionUseCase } from '../../application/get-transaction.usecase';
import { ProcessPaymentUseCase } from '../../application/process-payment.usecase';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionsController } from './transactions.controller';

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
  items: [{ productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 2 }],
  createdAt: new Date('2026-07-10T00:00:00Z'),
  updatedAt: new Date('2026-07-10T00:00:00Z'),
};

describe('TransactionsController', () => {
  const processPayment = {
    execute: jest.fn(),
  } as unknown as ProcessPaymentUseCase;
  const getTransaction = {
    execute: jest.fn(),
  } as unknown as GetTransactionUseCase;
  const controller = new TransactionsController(processPayment, getTransaction);

  afterEach(() => jest.clearAllMocks());

  it('create arma el comando con defaults de pais e installments', async () => {
    (processPayment.execute as jest.Mock).mockResolvedValue(tx);

    const dto: CreateTransactionDto = {
      customer: { email: 'k@e.com', fullName: 'K' },
      shipping: {
        firstName: 'K',
        lastName: 'S',
        address: 'a',
        city: 'b',
        postalCode: '1',
      },
      items: [{ productId: 'tea-set', qty: 2 }],
      card: {
        number: '4242424242424242',
        cardHolder: 'K S',
        expMonth: '12',
        expYear: '28',
        cvc: '123',
      },
    };

    const res = await controller.create(dto);

    const command = (processPayment.execute as jest.Mock).mock.calls[0][0];
    expect(command.shipping.country).toBe('Colombia');
    expect(command.card.installments).toBe(1);
    expect(res.status).toBe('approved');
    expect(res.reference).toBe('YUGEN-1');
  });

  it('findOne devuelve el detalle', async () => {
    (getTransaction.execute as jest.Mock).mockResolvedValue(tx);

    const res = await controller.findOne('YUGEN-1');

    expect(getTransaction.execute).toHaveBeenCalledWith('YUGEN-1');
    expect(res.itemCount).toBe(2);
  });
});
