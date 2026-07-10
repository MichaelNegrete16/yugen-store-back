import { NotFoundException } from '@nestjs/common';
import { Product, ProductCategory } from '../domain/product';
import { ProductRepositoryPort } from '../domain/product.repository.port';
import { GetProductUseCase } from './get-product.use-case';

describe('GetProductUseCase', () => {
  const product: Product = {
    id: 'tea-set',
    name: 'Juego de Té de Basalto',
    priceCop: 320000,
    category: ProductCategory.Tea,
    image: 'https://example.com/tea.jpg',
    rating: 4.9,
    stock: 8,
  };

  const repo: jest.Mocked<ProductRepositoryPort> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    decreaseStock: jest.fn(),
  };

  afterEach(() => jest.clearAllMocks());

  it('devuelve el producto cuando existe', async () => {
    repo.findById.mockResolvedValue(product);
    const useCase = new GetProductUseCase(repo);

    await expect(useCase.execute('tea-set')).resolves.toEqual(product);
    expect(repo.findById).toHaveBeenCalledWith('tea-set');
  });

  it('lanza NotFoundException cuando el producto no existe', async () => {
    repo.findById.mockResolvedValue(null);
    const useCase = new GetProductUseCase(repo);

    await expect(useCase.execute('no-existe')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
