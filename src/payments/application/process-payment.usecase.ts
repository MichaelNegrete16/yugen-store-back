import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PRODUCT_REPOSITORY } from '../../products/domain/repository/product.repository';
import type { ProductRepository } from '../../products/domain/repository/product.repository';
import { PRICING_CONFIG } from '../../shared/pricing/pricing.module';
import {
  PricedLine,
  calculatePriceBreakdown,
} from '../../shared/pricing/price-breakdown';
import type { PricingConfig } from '../../shared/pricing/price-breakdown';
import { fromGatewayStatus } from '../domain/gateway-status';
import { GatewayResponseError } from '../domain/gateway.error';
import { PAYMENT_GATEWAY } from '../domain/repository/payment-gateway.repository';
import type {
  CardDetails,
  PaymentGateway,
} from '../domain/repository/payment-gateway.repository';
import { generateReference } from '../domain/reference';
import {
  Customer,
  Delivery,
  Transaction,
  TransactionItem,
  TransactionStatus,
} from '../domain/entities/transaction.entity';
import { TRANSACTION_REPOSITORY } from '../domain/repository/transaction.repository';
import type { TransactionRepository } from '../domain/repository/transaction.repository';

export interface ProcessPaymentCommand {
  customer: Customer;
  shipping: Delivery;
  items: { productId: string; qty: number }[];
  discountCode?: string;
  card: CardDetails & { installments: number };
  acceptanceToken?: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly gateway: PaymentGateway,
    @Inject(PRICING_CONFIG)
    private readonly pricing: PricingConfig,
    private readonly config: ConfigService,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Transaction> {
    const { lines, items } = await this.resolveItems(command.items);

    const breakdown = calculatePriceBreakdown(
      lines,
      command.discountCode,
      this.pricing,
    );

    const currency = String(this.config.get('GATEWAY_CURRENCY') ?? 'COP');
    const reference = generateReference();

    const { brand, last4, status, gatewayTransactionId } = await this.charge(
      command,
      breakdown.total,
      currency,
      reference,
    );

    const transaction = await this.transactions.create({
      reference,
      status,
      amountCop: breakdown.total,
      breakdown,
      currency,
      cardBrand: brand,
      cardLast4: last4,
      gatewayTransactionId,
      customer: command.customer,
      delivery: command.shipping,
      items,
    });

    if (status === TransactionStatus.Approved) {
      await this.decreaseStock(items);
    }

    return transaction;
  }

  private async resolveItems(
    requested: { productId: string; qty: number }[],
  ): Promise<{ lines: PricedLine[]; items: TransactionItem[] }> {
    const lines: PricedLine[] = [];
    const items: TransactionItem[] = [];

    for (const item of requested) {
      const product = await this.products.findById(item.productId);
      if (!product) {
        throw new UnprocessableEntityException(
          `Producto no encontrado: ${item.productId}`,
        );
      }
      if (product.stock < item.qty) {
        throw new UnprocessableEntityException(
          `Sin stock suficiente para ${product.id} (disponible: ${product.stock})`,
        );
      }
      lines.push({ unitPriceCop: product.priceCop, qty: item.qty });
      items.push({
        productId: product.id,
        name: product.name,
        unitPriceCop: product.priceCop,
        qty: item.qty,
      });
    }

    return { lines, items };
  }

  private async charge(
    command: ProcessPaymentCommand,
    totalCop: number,
    currency: string,
    reference: string,
  ): Promise<{
    brand: string;
    last4: string;
    status: TransactionStatus;
    gatewayTransactionId: string | null;
  }> {
    try {
      const token = await this.gateway.tokenizeCard(command.card);
      const tokens = await this.gateway.getAcceptanceTokens();

      const charge = await this.gateway.createCharge({
        reference,
        amountInCents: totalCop * 100,
        currency,
        customerEmail: command.customer.email,
        cardToken: token.token,
        installments: command.card.installments,
        acceptanceToken: command.acceptanceToken ?? tokens.acceptanceToken,
        acceptPersonalAuth: tokens.acceptPersonalAuth,
      });

      return {
        brand: token.brand,
        last4: token.last4,
        status: fromGatewayStatus(charge.status),
        gatewayTransactionId: charge.gatewayTransactionId,
      };
    } catch (error) {
      // Si la pasarela rechazó el medio de pago (4xx), no es una caída:
      // registramos la transacción como rechazada y seguimos el flujo normal.
      if (error instanceof GatewayResponseError && error.isRejection) {
        this.logger.warn(
          `Pago rechazado por la pasarela en ${reference}: ${error.message}`,
        );
        return {
          brand: '',
          last4: command.card.number.slice(-4),
          status: TransactionStatus.Declined,
          gatewayTransactionId: null,
        };
      }
      this.logger.error(`GATEWAY_ERROR en ${reference}`, error as Error);
      throw new BadGatewayException('GATEWAY_ERROR');
    }
  }

  private async decreaseStock(items: TransactionItem[]): Promise<void> {
    for (const item of items) {
      await this.products.decreaseStock(item.productId, item.qty);
    }
  }
}
