import { Repository } from 'typeorm';
import { ProductCategory } from '../../domain/entities/product.entity';
import { ProductModel } from '../models/product.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  const entity: ProductModel = {
    id: 'tea-set',
    name: 'Juego de Té',
    priceCop: 320000,
    category: ProductCategory.Tea,
    image: 'https://x/tea.jpg',
    rating: 4.9,
    stock: 8,
    badge: null,
    description: null,
    artisan: null,
  };

  let repo: jest.Mocked<Repository<ProductModel>>;
  let service: ProductService;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      decrement: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProductModel>>;
    service = new ProductService(repo);
  });

  it('findAll devuelve los productos mapeados', async () => {
    repo.find.mockResolvedValue([entity]);

    const result = await service.findAll();

    expect(result).toEqual([entity]);
    expect(repo.find).toHaveBeenCalledWith({ order: { name: 'ASC' } });
  });

  it('findById devuelve el producto cuando existe', async () => {
    repo.findOne.mockResolvedValue(entity);

    await expect(service.findById('tea-set')).resolves.toEqual(entity);
  });

  it('findById devuelve null cuando no existe', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findById('nope')).resolves.toBeNull();
  });

  it('decreaseStock delega en el decremento del repositorio', async () => {
    await service.decreaseStock('tea-set', 2);

    expect(repo.decrement).toHaveBeenCalledWith({ id: 'tea-set' }, 'stock', 2);
  });
});
