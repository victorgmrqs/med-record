import { describe, expect, it } from 'vitest';

import { healthCheck } from './healthcheck.usecase';

describe('healthCheck', () => {
  it('deve retornar "OK"', () => {
    expect(healthCheck()).toBe('OK');
  });
});
