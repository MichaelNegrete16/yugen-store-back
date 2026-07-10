import { GatewayStatus } from './payment-gateway.port';
import { TransactionStatus } from './transaction';

export function fromGatewayStatus(status: GatewayStatus): TransactionStatus {
  switch (status) {
    case 'APPROVED':
      return TransactionStatus.Approved;
    case 'PENDING':
      return TransactionStatus.Pending;
    case 'DECLINED':
    case 'VOIDED':
      return TransactionStatus.Declined;
    default:
      return TransactionStatus.Error;
  }
}

export function isFinalStatus(status: TransactionStatus): boolean {
  return status !== TransactionStatus.Pending;
}
