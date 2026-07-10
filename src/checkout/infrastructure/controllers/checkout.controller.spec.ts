import { QuoteUseCase } from '../../application/quote.usecase';
import { CheckoutController } from './checkout.controller';

describe('CheckoutController', () => {
  const quote = { execute: jest.fn() } as unknown as QuoteUseCase;
  const controller = new CheckoutController(quote);

  it('quoteOrder delega en QuoteUseCase con items y codigo', async () => {
    const breakdown = { subtotal: 1, shipping: 2, tax: 3, discount: 0, total: 6 };
    (quote.execute as jest.Mock).mockResolvedValue(breakdown);

    const dto = {
      items: [{ productId: 'tea-set', qty: 1 }],
      discountCode: 'YUGEN10',
    };
    await expect(controller.quoteOrder(dto)).resolves.toEqual(breakdown);
    expect(quote.execute).toHaveBeenCalledWith(dto.items, 'YUGEN10');
  });
});
