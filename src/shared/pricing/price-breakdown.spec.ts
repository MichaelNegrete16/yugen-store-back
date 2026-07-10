import {
  PricingConfig,
  calculatePriceBreakdown,
} from './price-breakdown';

describe('calculatePriceBreakdown', () => {
  const config: PricingConfig = {
    shippingCop: 15000,
    ivaRate: 0.19,
    discountCode: 'YUGEN10',
    discountRate: 0.1,
  };

  it('calcula subtotal, envio, IVA y total sin descuento', () => {
    const result = calculatePriceBreakdown(
      [{ unitPriceCop: 320000, qty: 2 }],
      undefined,
      config,
    );

    expect(result).toEqual({
      subtotal: 640000,
      shipping: 15000,
      tax: 121600, // round(640000 * 0.19)
      discount: 0,
      total: 776600, // 640000 + 15000 + 121600
    });
  });

  it('aplica el descuento YUGEN10 (10%)', () => {
    const result = calculatePriceBreakdown(
      [{ unitPriceCop: 320000, qty: 2 }],
      'YUGEN10',
      config,
    );

    expect(result.discount).toBe(64000); // round(640000 * 0.10)
    expect(result.total).toBe(712600); // 640000 + 15000 + 121600 - 64000
  });

  it('acepta el codigo de descuento sin importar mayusculas/espacios', () => {
    const result = calculatePriceBreakdown(
      [{ unitPriceCop: 100000, qty: 1 }],
      '  yugen10 ',
      config,
    );

    expect(result.discount).toBe(10000);
  });

  it('ignora codigos de descuento invalidos', () => {
    const result = calculatePriceBreakdown(
      [{ unitPriceCop: 100000, qty: 1 }],
      'NOEXISTE',
      config,
    );

    expect(result.discount).toBe(0);
  });

  it('no cobra envio cuando el carrito esta vacio', () => {
    const result = calculatePriceBreakdown([], 'YUGEN10', config);

    expect(result).toEqual({
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0,
    });
  });

  it('suma varias lineas y redondea el IVA correctamente', () => {
    const result = calculatePriceBreakdown(
      [
        { unitPriceCop: 245000, qty: 1 },
        { unitPriceCop: 340000, qty: 3 },
      ],
      undefined,
      config,
    );

    const subtotal = 245000 + 340000 * 3; // 1265000
    expect(result.subtotal).toBe(subtotal);
    expect(result.tax).toBe(Math.round(subtotal * 0.19)); // 240350
    expect(result.total).toBe(subtotal + 15000 + result.tax);
  });
});
