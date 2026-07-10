# Yūgen Store — Backend

Backend del checkout de pago con tarjeta para la tienda **Yūgen Store**. La app móvil
(React Native) consume únicamente esta API, y esta API es la única que se comunica con la
pasarela de pago (sandbox). Toda la lógica de precios, persistencia y flujo de pago vive aquí.

Construido con **NestJS + TypeScript + PostgreSQL (TypeORM)** siguiendo arquitectura
**hexagonal** (puertos y adaptadores).

## Stack

- **NestJS 11** + **TypeScript**
- **PostgreSQL 16** + **TypeORM**
- **class-validator / class-transformer** para validación de DTOs
- **Jest** para tests (cobertura > 80%)
- **Docker** + **docker-compose**
- Gestor de paquetes: **pnpm**

## Arquitectura

Cada módulo se organiza por capas (dominio → aplicación → infraestructura):

```
src/
  shared/            config, filtros de error, cálculo de precios, health
  products/          catálogo
    domain/          entities · repository (puertos)
    application/     casos de uso (*.usecase.ts)
    infrastructure/  controllers · dtos · models (ORM) · services (adaptadores) · mappers · seeders
  checkout/          cotización
  payments/          transacciones, pasarela, historial
```

El dominio define los **puertos** (`ProductRepository`, `TransactionRepository`,
`PaymentGateway`) y la infraestructura los **adaptadores** (TypeORM, HTTP/stub de la pasarela).
El caso de uso no conoce la implementación concreta.

## Requisitos

- Node.js 22+
- pnpm 11+
- Docker (opcional, para levantar todo con un comando)

## Configuración

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

| Variable                                                        | Descripción                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| `PORT`                                                          | Puerto de la API (default 3000)                             |
| `NODE_ENV`                                                      | `development` \| `production` \| `test`                     |
| `CORS_ORIGIN`                                                   | Origen permitido para la app (`*` en dev)                   |
| `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`                   | Conexión a PostgreSQL                                       |
| `GATEWAY_MODE`                                                  | `stub` (simulado, sin red) o `http` (pasarela real sandbox) |
| `GATEWAY_BASE_URL`                                              | URL base del sandbox de la pasarela                         |
| `GATEWAY_PUBLIC_KEY` / `GATEWAY_PRIVATE_KEY`                    | Llaves pública/privada                                      |
| `GATEWAY_INTEGRITY_SECRET`                                      | Secreto para la firma de integridad                         |
| `GATEWAY_EVENTS_SECRET`                                         | Secreto de eventos/webhook                                  |
| `GATEWAY_CURRENCY`                                              | Moneda (COP)                                                |
| `SHIPPING_COP` / `IVA_RATE` / `DISCOUNT_CODE` / `DISCOUNT_RATE` | Reglas de negocio                                           |

> **Nunca** se commitean llaves reales: `.env` está en `.gitignore`, solo se versiona `.env.example`.

### Modo de la pasarela (`GATEWAY_MODE`)

- **`stub`** (default): adaptador simulado, sin llamadas HTTP. Ideal para desarrollo local,
  tests y la demo con Docker. Tarjetas cuyo `last4` es `0002` salen declinadas; el resto aprobadas.
- **`http`**: adaptador real contra el sandbox. Requiere las llaves reales en `.env`.

## Cómo ejecutar

### Con Docker (recomendado, turnkey)

```bash
docker compose up --build
```

Levanta `postgres` + `api`, crea el esquema y carga el catálogo inicial. La API queda en
`http://localhost:3000/api/v1`.

### Local con pnpm

```bash
pnpm install
# requiere un PostgreSQL corriendo según tu .env
pnpm run start:dev
```

## Tests y cobertura

```bash
pnpm test           # unit tests
pnpm run test:cov   # con reporte de cobertura
```

Cobertura actual (`pnpm run test:cov`) — **80 tests, 26 suites**:

## Endpoints (`/api/v1`)

| Método | Ruta                       | Descripción                                 |
| ------ | -------------------------- | ------------------------------------------- |
| `GET`  | `/health`                  | Estado del servicio                         |
| `GET`  | `/products`                | Catálogo                                    |
| `GET`  | `/products/:id`            | Detalle de producto                         |
| `POST` | `/checkout/quote`          | Cotiza (subtotal + envío + IVA + descuento) |
| `POST` | `/transactions`            | Crea el pago con tarjeta                    |
| `GET`  | `/transactions/:reference` | Estado de la transacción (polling)          |
| `GET`  | `/orders?email=`           | Historial de compras del cliente            |

Los errores usan un envelope consistente:

```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": ["detalle..."]
}
```

## Reglas de negocio (precios)

El backend es la **fuente de verdad**: recalcula el total desde los ítems y el código de
descuento, nunca confía en un total enviado por el cliente. Moneda en **COP enteros**.

- **Envío:** `SHIPPING_COP` (0 si el carrito está vacío)
- **IVA:** `round(subtotal × 0.19)`
- **Descuento:** código `YUGEN10` = `round(subtotal × 0.10)`; cualquier otro = 0
- **Total:** `subtotal + envío + IVA − descuento`

## Flujo de pago

1. Se valida stock y se recalcula el total.
2. Se tokeniza la tarjeta (nunca se persiste el número completo ni el CVV → solo `cardBrand` + `cardLast4`).
3. Se genera la referencia y la firma de integridad `SHA256(reference + amount_in_cents + currency + integrity_secret)`.
4. Se crea la transacción en la pasarela.
5. Si queda `PENDING`, el front hace polling a `GET /transactions/:reference`; el backend
   re-consulta la pasarela, actualiza el estado y descuenta stock al aprobarse.

## Tarjetas de prueba (sandbox)

| Tarjeta               | Resultado |
| --------------------- | --------- |
| `4242 4242 4242 4242` | Aprobada  |
| `4111 1111 1111 1111` | Declinada |
| Cualquier otra        | Error     |

Cualquier fecha de expiración futura y CVC de 3 dígitos.

## Seguridad

- No se persiste ni loguea el PAN ni el CVV. Solo se guardan `cardBrand` + `cardLast4`.
- La firma de integridad se calcula en el servidor (nunca en el cliente).
- Validación de todos los DTOs (email, expiración, cantidades, stock).
- Idempotencia por `reference` único.
