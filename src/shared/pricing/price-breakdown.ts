/** Desglose de precios de un pedido, todo en COP enteros. */
export interface PriceBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

/** Parametros de negocio para el calculo (vienen del entorno). */
export interface PricingConfig {
  shippingCop: number;
  ivaRate: number;
  discountCode: string;
  discountRate: number;
}

/** Una linea ya valorizada: precio unitario y cantidad. */
export interface PricedLine {
  unitPriceCop: number;
  qty: number;
}

/**
 * Fuente de verdad del calculo de precios. Es una funcion pura: dado el detalle
 * valorizado, el codigo de descuento y la configuracion, produce el desglose.
 *
 * - subtotal = Σ(unitPriceCop × qty)
 * - envio = shippingCop (0 si el carrito esta vacio)
 * - IVA = round(subtotal × ivaRate)
 * - descuento = round(subtotal × discountRate) si el codigo coincide, si no 0
 * - total = subtotal + envio + IVA − descuento
 */
export function calculatePriceBreakdown(
  lines: PricedLine[],
  discountCode: string | undefined | null,
  config: PricingConfig,
): PriceBreakdown {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPriceCop * line.qty,
    0,
  );

  const shipping = subtotal > 0 ? config.shippingCop : 0;
  const tax = Math.round(subtotal * config.ivaRate);

  const codeMatches =
    !!discountCode &&
    discountCode.trim().toUpperCase() === config.discountCode.toUpperCase();
  const discount = codeMatches ? Math.round(subtotal * config.discountRate) : 0;

  const total = subtotal + shipping + tax - discount;

  return { subtotal, shipping, tax, discount, total };
}
