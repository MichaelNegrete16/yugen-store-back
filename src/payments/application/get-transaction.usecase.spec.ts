import { NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../products/domain/repository/product.repository';
import {
  Transaction,
  TransactionStatus,
} from '../domain/entities/transaction.entity';
import { PaymentGateway } from '../domain/repository/payment-gateway.repository';
import { TransactionRepository } from '../domain/repository/transaction.repository';
import { GetTransactionUseCase } from './get-transaction.usecase';

describe('GetTransactionUseCase', () => {
  let repo: jest.Mocked<TransactionRepository>;
  let gateway: jest.Mocked<PaymentGateway>;
  let products: jest.Mocked<ProductRepository>;
  let useCase: GetTransactionUseCase;

  const approved = {
    id: 'uuid-1',
    reference: 'YUGEN-1',
    status: TransactionStatus.Approved,
    gatewayTransactionId: 'gw_1',
    items: [{ productId: 'tea-set', name: 'Té', unitPriceCop: 320000, qty: 2 }],
  } as Transaction;

  const pending = {
    ...approved,
    reference: 'YUGEN-2',
    status: TransactionStatus.Pending,
  } as Transaction;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByReference: jest.fn(),
      findByCustomerEmail: jest.fn(),
      updateStatus: jest.fn(),
    };
    gateway = {
      getAcceptanceTokens: jest.fn(),
      tokenizeCard: jest.fn(),
      createCharge: jest.fn(),
      getCharge: jest.fn(),
    };
    products = {
      findAll: jest.fn(),
      findById: jest.fn(),
      decreaseStock: jest.fn(),
    };
    useCase = new GetTransactionUseCase(repo, gateway, products);
  });

  it('lanza NotFoundException cuando no existe', async () => {
    repo.findByReference.mockResolvedValue(null);
    await expect(useCase.execute('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('no consulta la pasarela si ya esta en estado final', async () => {
    repo.findByReference.mockResolvedValue(approved);

    const result = await useCase.execute('YUGEN-1');

    expect(result.status).toBe(TransactionStatus.Approved);
    expect(gateway.getCharge).not.toHaveBeenCalled();
  });

  it('refresca a aprobada, actualiza la BD y descuenta stock', async () => {
    repo.findByReference.mockResolvedValue(pending);
    gateway.getCharge.mockResolvedValue({
      gatewayTransactionId: 'gw_1',
      status: 'APPROVED',
    });

    const result = await useCase.execute('YUGEN-2');

    expect(result.status).toBe(TransactionStatus.Approved);
    expect(repo.updateStatus).toHaveBeenCalledWith(
      'YUGEN-2',
      TransactionStatus.Approved,
      'gw_1',
    );
    expect(products.decreaseStock).toHaveBeenCalledWith('tea-set', 2);
  });

  it('si sigue pendiente en la pasarela, no toca BD ni stock', async () => {
    repo.findByReference.mockResolvedValue(pending);
    gateway.getCharge.mockResolvedValue({
      gatewayTransactionId: 'gw_1',
      status: 'PENDING',
    });

    const result = await useCase.execute('YUGEN-2');

    expect(result.status).toBe(TransactionStatus.Pending);
    expect(repo.updateStatus).not.toHaveBeenCalled();
    expect(products.decreaseStock).not.toHaveBeenCalled();
  });

  it('refresca a declinada sin descontar stock', async () => {
    repo.findByReference.mockResolvedValue(pending);
    gateway.getCharge.mockResolvedValue({
      gatewayTransactionId: 'gw_1',
      status: 'DECLINED',
    });

    const result = await useCase.execute('YUGEN-2');

    expect(result.status).toBe(TransactionStatus.Declined);
    expect(products.decreaseStock).not.toHaveBeenCalled();
  });
});
