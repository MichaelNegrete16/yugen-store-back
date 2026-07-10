import { CardDetails } from '../../domain/repository/payment-gateway.repository';
import { PaymentGatewayService } from './payment-gateway.service';

describe('PaymentGatewayService (stub)', () => {
  const service = new PaymentGatewayService();
  const card: CardDetails = {
    number: '4242424242424242',
    cardHolder: 'K S',
    expMonth: '12',
    expYear: '28',
    cvc: '123',
  };

  it('devuelve los tokens de aceptacion', async () => {
    await expect(service.getAcceptanceTokens()).resolves.toEqual({
      acceptanceToken: 'stub_acceptance_token',
      acceptPersonalAuth: 'stub_personal_auth',
    });
  });

  it.each([
    ['4242424242424242', 'VISA'],
    ['5111111111111111', 'MASTERCARD'],
    ['2221111111111111', 'MASTERCARD'],
    ['3711111111111111', 'UNKNOWN'],
  ])('detecta la marca de %s como %s', async (number, brand) => {
    const token = await service.tokenizeCard({ ...card, number });
    expect(token.brand).toBe(brand);
    expect(token.last4).toBe(number.slice(-4));
    expect(token.token).toBe(`tok_stub_${number.slice(-4)}`);
  });

  it('aprueba cargos por defecto', async () => {
    const charge = await service.createCharge({
      reference: 'YUGEN-1',
      amountInCents: 100,
      currency: 'COP',
      customerEmail: 'k@e.com',
      cardToken: 'tok_stub_4242',
      installments: 1,
    });
    expect(charge).toEqual({
      gatewayTransactionId: 'stub_YUGEN-1',
      status: 'APPROVED',
    });
  });

  it('declina cargos con last4 0002', async () => {
    const charge = await service.createCharge({
      reference: 'YUGEN-2',
      amountInCents: 100,
      currency: 'COP',
      customerEmail: 'k@e.com',
      cardToken: 'tok_stub_0002',
      installments: 1,
    });
    expect(charge.status).toBe('DECLINED');
  });

  it('getCharge devuelve estado aprobado', async () => {
    await expect(service.getCharge('gw_1')).resolves.toEqual({
      gatewayTransactionId: 'gw_1',
      status: 'APPROVED',
    });
  });
});
