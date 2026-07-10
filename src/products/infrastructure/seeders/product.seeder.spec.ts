import { Repository } from 'typeorm';
import { ProductModel } from '../models/product.model';
import { ProductSeeder } from './product.seeder';

describe('ProductSeeder', () => {
  let repo: jest.Mocked<Repository<ProductModel>>;
  let seeder: ProductSeeder;

  beforeEach(() => {
    repo = {
      count: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<ProductModel>>;
    seeder = new ProductSeeder(repo);
  });

  it('carga el catalogo inicial cuando la tabla esta vacia', async () => {
    repo.count.mockResolvedValue(0);

    await seeder.onModuleInit();

    expect(repo.save).toHaveBeenCalledTimes(1);
    const seeded = repo.save.mock.calls[0][0] as unknown[];
    expect(seeded).toHaveLength(3);
  });

  it('no hace nada si ya hay productos', async () => {
    repo.count.mockResolvedValue(3);

    await seeder.onModuleInit();

    expect(repo.save).not.toHaveBeenCalled();
  });
});
