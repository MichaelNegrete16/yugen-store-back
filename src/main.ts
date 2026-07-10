import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Prefijo global para toda la API.
  app.setGlobalPrefix('api/v1');

  // Validacion automatica de DTOs con class-validator.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      // El contrato usa 422 para errores de validacion.
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  // Envelope de error consistente para toda la API.
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS habilitado para la app movil (configurable por entorno).
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', '*'),
  });

  // Documentacion OpenAPI en /api/v1/docs.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Yūgen Store API')
    .setDescription(
      'API del checkout de pago con tarjeta de Yūgen Store. Catálogo, ' +
        'cotización, transacciones (pago con tarjeta), estado y historial de compras.',
    )
    .setVersion('1.0')
    .addTag('products', 'Catálogo de productos')
    .addTag('checkout', 'Cotización del pedido')
    .addTag('transactions', 'Pago con tarjeta y estado de la transacción')
    .addTag('orders', 'Historial de compras')
    .addTag('health', 'Estado del servicio')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'Yūgen Store API — Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
}

void bootstrap();
