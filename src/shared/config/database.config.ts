import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Construye las opciones de conexion a PostgreSQL a partir del entorno.
 * `autoLoadEntities` deja que cada modulo registre sus entidades, y
 * `synchronize` se activa solo fuera de produccion para el desarrollo local.
 */
export function buildTypeOrmOptions(
  config: ConfigService,
): TypeOrmModuleOptions {
  const isProduction = config.get<string>('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: !isProduction,
  };
}
