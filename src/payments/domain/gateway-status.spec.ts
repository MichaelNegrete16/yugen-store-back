import { fromGatewayStatus, isFinalStatus } from './gateway-status';
import { TransactionStatus } from './entities/transaction.entity';

describe('fromGatewayStatus', () => {
  it.each([
    ['APPROVED', TransactionStatus.Approved],
    ['PENDING', TransactionStatus.Pending],
    ['DECLINED', TransactionStatus.Declined],
    ['VOIDED', TransactionStatus.Declined],
    ['ERROR', TransactionStatus.Error],
  ] as const)('mapea %s -> %s', (gateway, expected) => {
    expect(fromGatewayStatus(gateway)).toBe(expected);
  });
});

describe('isFinalStatus', () => {
  it('PENDING no es final', () => {
    expect(isFinalStatus(TransactionStatus.Pending)).toBe(false);
  });

  it('APPROVED es final', () => {
    expect(isFinalStatus(TransactionStatus.Approved)).toBe(true);
  });
});
