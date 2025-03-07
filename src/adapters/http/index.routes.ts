import { FastifyInstance } from 'fastify';

import { appHealthCheckRoutes } from './healthCheck.routes';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(appHealthCheckRoutes, { prefix: 'healthz' });
}
