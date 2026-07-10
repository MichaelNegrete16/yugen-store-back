export interface CardDetails {
  number: string;
  cardHolder: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}

export interface CardToken {
  token: string;
  brand: string;
  last4: string;
}

export type GatewayStatus =
  | 'APPROVED'
  | 'DECLINED'
  | 'PENDING'
  | 'VOIDED'
  | 'ERROR';

export interface CreateChargeInput {
  reference: string;
  amountInCents: number;
  currency: string;
  customerEmail: string;
  cardToken: string;
  installments: number;
  acceptanceToken?: string;
}

export interface GatewayCharge {
  gatewayTransactionId: string;
  status: GatewayStatus;
}

export interface PaymentGatewayPort {
  getAcceptanceToken(): Promise<string>;
  tokenizeCard(card: CardDetails): Promise<CardToken>;
  createCharge(input: CreateChargeInput): Promise<GatewayCharge>;
  getCharge(gatewayTransactionId: string): Promise<GatewayCharge>;
}

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');
