import { ConfigService } from '@nestjs/config';
import { buildTypeOrmOptions } from './database.config';

function configWith(env: Record<string, unknown>): ConfigService {
  return { get: (key: string) => env[key] } as unknown as ConfigService;
}

describe('buildTypeOrmOptions', () => {
  const base = {
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_USER: 'postgres',
    DB_PASSWORD: 'postgres',
    DB_NAME: 'yugen',
  };

  it('activa synchronize fuera de produccion', () => {
    const options = buildTypeOrmOptions(
      configWith({ ...base, NODE_ENV: 'development' }),
    );

    expect(options).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'yugen',
      synchronize: true,
      autoLoadEntities: true,
    });
  });

  it('desactiva synchronize en produccion', () => {
    const options = buildTypeOrmOptions(
      configWith({ ...base, NODE_ENV: 'production' }),
    );

    expect(options).toMatchObject({ synchronize: false });
  });
});
