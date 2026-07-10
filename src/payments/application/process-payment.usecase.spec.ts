import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException } from '@nestjs/common';
import { Product, ProductCategory } from '../../products/domain/entities/product.entity';
import { ProductRepositoryPort } from '../../products/domain/repository/product.repository';
import { PricingConfig } from '../../shared/pricing/price-breakdown';
import { PaymentGatewayPort } from '../domain/repository/payment-gateway.repository';
import { Transaction, TransactionStatus } from '../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../domain/repository/transaction.repository';
import {
  ProcessPaymentCommand,
  ProcessPaymentUseCase,
} from './process-payment.usecase';

describe('ProcessPaymentUseCase', () => {
  const teaSet: Product = {
    id: 'tea-set',
    name: 'Juego de Té de Basalto',
    priceCop: 320000,
    category: ProductCategory.Tea,
    image: 'https://example.com/tea.jpg',
    rating: 4.9,
    stock: 8,
  };

  const pricing: PricingConfig = {
    shippingCop: 15000,
    ivaRate: 0.19,
    discountCode: 'YUGEN10',
    discountRate: 0.1,
  };

  const command: ProcessPaymentCommand = {
    customer: { email: 'kenji@example.com', fullName: 'Kenji Sato' },
    shipping: {
      firstName: 'Kenji',
      lastName: 'Sato',
      address: 'Cra 7 45-10',
      city: 'Bogotá',
      postalCode: '110111',
      country: 'Colombia',
    },
    items: [{ productId: 'tea-set', qty: 2 }],
    discountCode: 'YUGEN10',
    card: {
      number: '4242424242424242',
      cardHolder: 'KENJI SATO',
      expMonth: '12',
      expYear: '28',
      cvc: '123',
      installments: 1,
    },
  };

  let products: jest.Mocked<ProductRepositoryPort>;
  let transactions: jest.Mocked<TransactionRepositoryPort>;
  let gateway: jest.Mocked<PaymentGatewayPort>;
  let useCase: ProcessPaymentUseCase;

  const config = { get: () => 'COP' } as unknown as ConfigService;

  beforeEach(() => {
    products = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(teaSet),
      decreaseStock: jest.fn(),
    };
    transactions = {
      create: jest.fn((data) =>
        Promise.resolve({
          ...data,
          id: 'uuid-1',
          createdAt: new Date('2026-07-10T00:00:00Z'),
          updatedAt: new Date('2026-07-10T00:00:00Z'),
        } as Transaction),
      ),
      findByReference: jest.fn(),
      findByCustomerEmail: jest.fn(),
      updateStatus: jest.fn(),
    };
    gateway = {
      getAcceptanceToken: jest.fn().mockResolvedValue('acc_token'),
      tokenizeCard: jest
        .fn()
        .mockResolvedValue({ token: 'tok_1', brand: 'VISA', last4: '4242' }),
      createCharge: jest.fn().mockResolvedValue({
        gatewayTransactionId: 'gw_1',
        status: 'APPROVED',
      }),
      getCharge: jest.fn(),
    };
    useCase = new ProcessPaymentUseCase(
      products,
      transactions,
      gateway,
      pricing,
      config,
    );
  });

  it('crea la transaccion con el total recalculado y descuenta stock si es aprobada', async () => {
    const result = await useCase.execute(command);

    expect(result.amountCop).toBe(712600);
    expect(result.cardBrand).toBe('VISA');
    expect(result.cardLast4).toBe('4242');
    expect(result.status).toBe(TransactionStatus.Approved);
    expect(products.decreaseStock).toHaveBeenCalledWith('tea-set', 2);
    expect(gateway.createCharge).toHaveBeenCalledWith(
      expect.objectContaining({ amountInCents: 71260000, currency: 'COP' }),
    );
  });

  it('no descuenta stock cuando el pago es declinado', async () => {
    gateway.createCharge.mockResolvedValue({
      gatewayTransactionId: 'gw_2',
      status: 'DECLINED',
    });

    const result = await useCase.execute(command);

    expect(result.status).toBe(TransactionStatus.Declined);
    expect(products.decreaseStock).not.toHaveBeenCalled();
  });

  it('rechaza con 422 cuando no hay stock suficiente', async () => {
    products.findById.mockResolvedValue({ ...teaSet, stock: 1 });

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
    expect(gateway.createCharge).not.toHaveBeenCalled();
  });

  it('rechaza con 422 cuando el producto no existe', async () => {
    products.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
  });
});
