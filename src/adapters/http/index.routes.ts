import { FastifyInstance } from 'fastify';

import { doctorRoutes } from './doctor.routes';
import { appHealthCheckRoutes } from './healthCheck.routes';
import { patientsRoutes } from './patient.routes';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(appHealthCheckRoutes, { prefix: 'healthz' });
  fastify.register(doctorRoutes, { prefix: 'doctors' });
  fastify.register(patientsRoutes, { prefix: 'patients' });
}
