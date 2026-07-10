import { Product, ProductCategory } from '../domain/product';
import { ProductRepositoryPort } from '../domain/product.repository.port';
import { ListProductsUseCase } from './list-products.use-case';

describe('ListProductsUseCase', () => {
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

  it('devuelve la lista de productos del repositorio', async () => {
    repo.findAll.mockResolvedValue([product]);
    const useCase = new ListProductsUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual([product]);
    expect(repo.findAll).toHaveBeenCalledTimes(1);
  });

  it('devuelve una lista vacia cuando no hay productos', async () => {
    repo.findAll.mockResolvedValue([]);
    const useCase = new ListProductsUseCase(repo);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
