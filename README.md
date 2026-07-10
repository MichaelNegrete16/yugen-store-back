# Yūgen Store — Backend

Backend del checkout de pago con tarjeta para la tienda **Yūgen Store**. Construido con
**NestJS + TypeScript + PostgreSQL (TypeORM)** siguiendo arquitectura hexagonal (puertos y
adaptadores).

La app móvil (React Native) habla **únicamente** con este backend, y este backend es el
único que se comunica con la pasarela de pago (sandbox). Toda la lógica de precios,
persistencia y flujo de pago vive aquí.

## Estado

🚧 En construcción. Se está desarrollando el ciclo básico primero (catálogo, cotización,
transacciones, estado, historial) y la integración con la pasarela se implementa al final.

## Stack

- NestJS + TypeScript
- PostgreSQL + TypeORM
- class-validator / class-transformer
- Jest (objetivo de cobertura > 80%)
- Docker + docker-compose

## Documentación

Más instrucciones de instalación, ejecución y tests se agregarán a medida que avance el
desarrollo.
