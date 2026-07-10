import { NotFoundException } from '@nestjs/common';
import { Product, ProductCategory } from '../../products/domain/entities/product.entity';
import { ProductRepositoryPort } from '../../products/domain/repository/product.repository';
import { PricingConfig } from '../../shared/pricing/price-breakdown';
import { QuoteUseCase } from './quote.usecase';

describe('QuoteUseCase', () => {
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

  const repo: jest.Mocked<ProductRepositoryPort> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    decreaseStock: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('cotiza usando el precio del backend, no del cliente', async () => {
    repo.findById.mockResolvedValue(teaSet);
    const useCase = new QuoteUseCase(repo, pricing);

    const result = await useCase.execute(
      [{ productId: 'tea-set', qty: 2 }],
      'YUGEN10',
    );

    expect(result).toEqual({
      subtotal: 640000,
      shipping: 15000,
      tax: 121600,
      discount: 64000,
      total: 712600,
    });
    expect(repo.findById).toHaveBeenCalledWith('tea-set');
  });

  it('lanza NotFoundException si un producto no existe', async () => {
    repo.findById.mockResolvedValue(null);
    const useCase = new QuoteUseCase(repo, pricing);

    await expect(
      useCase.execute([{ productId: 'fantasma', qty: 1 }]),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
