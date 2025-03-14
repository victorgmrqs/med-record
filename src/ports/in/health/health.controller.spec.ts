import { appHealthCheckRoutes } from 'adapters/http/healthCheck.routes';
import Fastify, { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';

describe('HealthController Integration Test', () => {
  const app: FastifyInstance = Fastify();
  beforeAll(async () => {
    app.register(appHealthCheckRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('shoudl return statuscode 200', async () => {
    const response = await app.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty('status');
  });
});
