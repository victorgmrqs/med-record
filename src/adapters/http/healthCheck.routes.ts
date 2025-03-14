import { FastifyInstance } from 'fastify';

import { HealthController } from '../../ports/in/health/health.controller';

const healthCheckController = new HealthController();
export async function appHealthCheckRoutes(fastify: FastifyInstance) {
  fastify.get('/', healthCheckController.handle);
}
