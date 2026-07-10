import { TransactionStatus, toAppStatus } from './transaction.entity';

describe('toAppStatus', () => {
  it.each([
    [TransactionStatus.Approved, 'approved'],
    [TransactionStatus.Pending, 'pending'],
    [TransactionStatus.Declined, 'declined'],
    [TransactionStatus.Error, 'declined'],
  ] as const)('mapea %s -> %s', (status, expected) => {
    expect(toAppStatus(status)).toBe(expected);
  });
});
