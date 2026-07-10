import { GetProductUseCase } from '../../application/get-product.usecase';
import { ListProductsUseCase } from '../../application/list-products.usecase';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  const listProducts = { execute: jest.fn() } as unknown as ListProductsUseCase;
  const getProduct = { execute: jest.fn() } as unknown as GetProductUseCase;
  const controller = new ProductsController(listProducts, getProduct);

  afterEach(() => jest.clearAllMocks());

  it('findAll delega en ListProducts', async () => {
    (listProducts.execute as jest.Mock).mockResolvedValue(['p']);

    await expect(controller.findAll()).resolves.toEqual(['p']);
    expect(listProducts.execute).toHaveBeenCalledTimes(1);
  });

  it('findOne delega en GetProduct con el id', async () => {
    (getProduct.execute as jest.Mock).mockResolvedValue('p');

    await expect(controller.findOne('tea-set')).resolves.toBe('p');
    expect(getProduct.execute).toHaveBeenCalledWith('tea-set');
  });
});
