import { FastifyInstance } from 'fastify';

import { appointmentsRoutes } from './appointments.routes';
import { doctorRoutes } from './doctor.routes';
import { appHealthCheckRoutes } from './healthCheck.routes';
import { medicalRecordRoutes } from './medicalRecors.routes';
import { patientsRoutes } from './patient.routes';

export default async function routes(fastify: FastifyInstance) {
  fastify.register(appHealthCheckRoutes, { prefix: 'healthz' });
  fastify.register(doctorRoutes, { prefix: 'doctors' });
  fastify.register(patientsRoutes, { prefix: 'patients' });
  fastify.register(appointmentsRoutes, { prefix: 'appointments' });
  fastify.register(medicalRecordRoutes, { prefix: 'medical-records' });
}
