import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { HttpPaymentGatewayService } from './http-payment-gateway.service';

const CONFIG: Record<string, string> = {
  GATEWAY_BASE_URL: 'https://sandbox/v1',
  GATEWAY_PUBLIC_KEY: 'pub_x',
  GATEWAY_PRIVATE_KEY: 'prv_x',
  GATEWAY_INTEGRITY_SECRET: 'int_x',
};

function okResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data }),
  });
}

describe('HttpPaymentGatewayService', () => {
  const config = { get: (k: string) => CONFIG[k] } as unknown as ConfigService;
  let service: HttpPaymentGatewayService;
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockReset();
    service = new HttpPaymentGatewayService(config);
  });

  it('getAcceptanceTokens consulta merchants con la llave publica', async () => {
    fetchMock.mockReturnValue(
      okResponse({
        presigned_acceptance: { acceptance_token: 'acc' },
        presigned_personal_data_auth: { acceptance_token: 'pda' },
      }),
    );

    const tokens = await service.getAcceptanceTokens();

    expect(tokens).toEqual({ acceptanceToken: 'acc', acceptPersonalAuth: 'pda' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://sandbox/v1/merchants/pub_x');
    expect(opts.headers.Authorization).toBe('Bearer pub_x');
  });

  it('tokenizeCard mapea la respuesta y envia el card_holder', async () => {
    fetchMock.mockReturnValue(
      okResponse({ id: 'tok_1', brand: 'VISA', last_four: '4242' }),
    );

    const result = await service.tokenizeCard({
      number: '4242424242424242',
      cardHolder: 'KENJI SATO',
      expMonth: '12',
      expYear: '29',
      cvc: '123',
    });

    expect(result).toEqual({ token: 'tok_1', brand: 'VISA', last4: '4242' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://sandbox/v1/tokens/cards');
    expect(opts.headers.Authorization).toBe('Bearer pub_x');
    expect(JSON.parse(opts.body).card_holder).toBe('KENJI SATO');
  });

  it('createCharge firma con SHA256 y usa la llave privada', async () => {
    fetchMock.mockReturnValue(okResponse({ id: 'gw_1', status: 'PENDING' }));

    const result = await service.createCharge({
      reference: 'YUGEN-1',
      amountInCents: 5000000,
      currency: 'COP',
      customerEmail: 'k@e.com',
      cardToken: 'tok_1',
      installments: 1,
      acceptanceToken: 'acc',
      acceptPersonalAuth: 'pda',
    });

    expect(result).toEqual({ gatewayTransactionId: 'gw_1', status: 'PENDING' });

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://sandbox/v1/transactions');
    expect(opts.headers.Authorization).toBe('Bearer prv_x');

    const body = JSON.parse(opts.body);
    const expectedSignature = createHash('sha256')
      .update('YUGEN-15000000COPint_x')
      .digest('hex');
    expect(body.signature).toBe(expectedSignature);
    expect(body.payment_method).toEqual({
      type: 'CARD',
      token: 'tok_1',
      installments: 1,
    });
    expect(body.accept_personal_auth).toBe('pda');
  });

  it('getCharge consulta el estado con la llave publica', async () => {
    fetchMock.mockReturnValue(okResponse({ id: 'gw_1', status: 'APPROVED' }));

    const result = await service.getCharge('gw_1');

    expect(result).toEqual({
      gatewayTransactionId: 'gw_1',
      status: 'APPROVED',
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://sandbox/v1/transactions/gw_1',
    );
  });

  it('lanza error cuando la pasarela responde no-ok', async () => {
    fetchMock.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: { reason: 'invalido' } }),
      }),
    );

    await expect(service.getCharge('gw_1')).rejects.toThrow(/422/);
  });
});
