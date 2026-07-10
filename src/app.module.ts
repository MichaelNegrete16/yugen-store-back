import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutModule } from './checkout/checkout.module';
import { ProductsModule } from './products/products.module';
import { buildTypeOrmOptions } from './shared/config/database.config';
import { validateEnv } from './shared/config/env.validation';
import { HealthController } from './shared/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmOptions,
    }),
    ProductsModule,
    CheckoutModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
