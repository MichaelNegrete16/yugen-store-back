import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Esquema de las variables de entorno. Si falta alguna obligatoria o tiene
 * un tipo inválido, la app falla al arrancar (fail-fast) en vez de romper
 * silenciosamente en tiempo de ejecución.
 */
export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  CORS_ORIGIN: string = '*';

  // Base de datos
  @IsString()
  DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  // Pasarela de pago (sandbox) — nombres genericos
  @IsString()
  GATEWAY_BASE_URL: string;

  @IsString()
  GATEWAY_PUBLIC_KEY: string;

  @IsString()
  GATEWAY_PRIVATE_KEY: string;

  @IsString()
  GATEWAY_INTEGRITY_SECRET: string;

  @IsString()
  GATEWAY_EVENTS_SECRET: string;

  @IsString()
  GATEWAY_CURRENCY: string = 'COP';

  // Reglas de negocio
  @IsInt()
  @Min(0)
  SHIPPING_COP: number = 15000;

  @IsNumber()
  @Min(0)
  @Max(1)
  IVA_RATE: number = 0.19;

  @IsString()
  DISCOUNT_CODE: string = 'YUGEN10';

  @IsNumber()
  @Min(0)
  @Max(1)
  DISCOUNT_RATE: number = 0.1;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Configuracion de entorno invalida:\n${errors.toString()}`,
    );
  }

  return validated;
}
