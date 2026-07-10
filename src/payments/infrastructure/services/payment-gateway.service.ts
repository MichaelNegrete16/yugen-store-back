import { Injectable } from '@nestjs/common';
import {
  CardDetails,
  CardToken,
  CreateChargeInput,
  GatewayCharge,
  GatewayStatus,
  PaymentGateway,
} from '../../domain/repository/payment-gateway.repository';

// Pasarela simulada para desarrollar el flujo completo sin llamadas HTTP.
// El adaptador real la reemplaza mas adelante. Tarjetas con last4 "0002" salen DECLINED.
@Injectable()
export class PaymentGatewayService implements PaymentGateway {
  getAcceptanceToken(): Promise<string> {
    return Promise.resolve('stub_acceptance_token');
  }

  tokenizeCard(card: CardDetails): Promise<CardToken> {
    const last4 = card.number.slice(-4);
    return Promise.resolve({
      token: `tok_stub_${last4}`,
      brand: this.detectBrand(card.number),
      last4,
    });
  }

  createCharge(input: CreateChargeInput): Promise<GatewayCharge> {
    const last4 = input.cardToken.replace('tok_stub_', '');
    const status: GatewayStatus = last4 === '0002' ? 'DECLINED' : 'APPROVED';
    return Promise.resolve({
      gatewayTransactionId: `stub_${input.reference}`,
      status,
    });
  }

  getCharge(gatewayTransactionId: string): Promise<GatewayCharge> {
    return Promise.resolve({ gatewayTransactionId, status: 'APPROVED' });
  }

  private detectBrand(number: string): string {
    if (number.startsWith('4')) {
      return 'VISA';
    }
    if (number.startsWith('5') || number.startsWith('2')) {
      return 'MASTERCARD';
    }
    return 'UNKNOWN';
  }
}
