import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('responde estado ok', () => {
    expect(new HealthController().check()).toEqual({
      status: 'ok',
      service: 'yugen-store-back',
    });
  });
});
