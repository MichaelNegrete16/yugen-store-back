import { NodeEnv, validateEnv } from './env.validation';

const validBase = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'yugen',
  GATEWAY_BASE_URL: 'https://sandbox/v1',
  GATEWAY_PUBLIC_KEY: 'pub',
  GATEWAY_PRIVATE_KEY: 'prv',
  GATEWAY_INTEGRITY_SECRET: 'int',
  GATEWAY_EVENTS_SECRET: 'evt',
};

describe('validateEnv', () => {
  it('valida y convierte tipos con la config completa', () => {
    const result = validateEnv(validBase);

    expect(result.DB_PORT).toBe(5432);
    expect(result.PORT).toBe(3000);
    expect(result.NODE_ENV).toBe(NodeEnv.Development);
    expect(result.IVA_RATE).toBe(0.19);
  });

  it('lanza error cuando falta una variable obligatoria', () => {
    const { DB_HOST, ...incomplete } = validBase;
    void DB_HOST;

    expect(() => validateEnv(incomplete)).toThrow(/entorno invalida/i);
  });

  it('lanza error cuando un tipo es invalido', () => {
    expect(() => validateEnv({ ...validBase, PORT: '99999' })).toThrow();
  });
});
