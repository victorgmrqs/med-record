// import { healthCheck } from 'application/repositories/health/healthCheck.usecase';
import { healthCheck } from 'application/services/health/healthcheck.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';

export class HealthController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const status = healthCheck();
    return reply.code(200).send({ status });
  }
}
