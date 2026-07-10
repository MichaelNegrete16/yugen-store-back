import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import {
  AcceptanceTokens,
  CardDetails,
  CardToken,
  CreateChargeInput,
  GatewayCharge,
  GatewayStatus,
  PaymentGateway,
} from '../../domain/repository/payment-gateway.repository';

// Adaptador real contra la pasarela sandbox. Implementa el mismo puerto que el
// stub, asi que el caso de uso no cambia.
@Injectable()
export class HttpPaymentGatewayService implements PaymentGateway {
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integritySecret: string;

  constructor(config: ConfigService) {
    this.baseUrl = String(config.get('GATEWAY_BASE_URL'));
    this.publicKey = String(config.get('GATEWAY_PUBLIC_KEY'));
    this.privateKey = String(config.get('GATEWAY_PRIVATE_KEY'));
    this.integritySecret = String(config.get('GATEWAY_INTEGRITY_SECRET'));
  }

  async getAcceptanceTokens(): Promise<AcceptanceTokens> {
    const { data } = await this.request(
      'GET',
      `/merchants/${this.publicKey}`,
      this.publicKey,
    );
    return {
      acceptanceToken: data.presigned_acceptance.acceptance_token,
      acceptPersonalAuth: data.presigned_personal_data_auth.acceptance_token,
    };
  }

  async tokenizeCard(card: CardDetails): Promise<CardToken> {
    const { data } = await this.request(
      'POST',
      '/tokens/cards',
      this.publicKey,
      {
        number: card.number,
        cvc: card.cvc,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        card_holder: card.cardHolder,
      },
    );
    return { token: data.id, brand: data.brand, last4: data.last_four };
  }

  async createCharge(input: CreateChargeInput): Promise<GatewayCharge> {
    const { data } = await this.request(
      'POST',
      '/transactions',
      this.privateKey,
      {
        acceptance_token: input.acceptanceToken,
        accept_personal_auth: input.acceptPersonalAuth,
        amount_in_cents: input.amountInCents,
        currency: input.currency,
        signature: this.buildSignature(input),
        customer_email: input.customerEmail,
        reference: input.reference,
        payment_method: {
          type: 'CARD',
          token: input.cardToken,
          installments: input.installments,
        },
      },
    );
    return { gatewayTransactionId: data.id, status: data.status };
  }

  async getCharge(gatewayTransactionId: string): Promise<GatewayCharge> {
    const { data } = await this.request(
      'GET',
      `/transactions/${gatewayTransactionId}`,
      this.publicKey,
    );
    return {
      gatewayTransactionId: data.id,
      status: data.status as GatewayStatus,
    };
  }

  private buildSignature(input: CreateChargeInput): string {
    const raw = `${input.reference}${input.amountInCents}${input.currency}${this.integritySecret}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  private async request(
    method: string,
    path: string,
    key: string,
    body?: Record<string, unknown>,
  ): Promise<{ data: any }> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = (await res.json()) as { data?: unknown; error?: unknown };
    if (!res.ok) {
      throw new Error(
        `Pasarela respondio ${res.status}: ${JSON.stringify(json.error ?? json)}`,
      );
    }
    return json as { data: any };
  }
}
