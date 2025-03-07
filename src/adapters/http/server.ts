import '@shared/container';
import { connectPrisma, prismaPlugin } from 'adapters/database/prisma/client';
import Fastify from 'fastify';
import logger from 'infra/logger';
import { ZodError } from 'zod';

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

import { env } from '@infra/env';
import AppError from '@shared/errors/AppError';

import routes from './index.routes';

const fastify = Fastify({
  logger: true,
});

fastify.register(prismaPlugin);
fastify.register(helmet);
fastify.register(cors, {
  origin: true,
});

// TODO: Aplicar o Swagger

fastify.register(routes, { prefix: '/api/v1' });

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    });
  }
  if (error instanceof AppError) {
    logger.error({
      code: error.code,
      message: error.message,
      service: error.service,
      correlator: request.headers.correlator,
      user_id: request.headers.userRegistration,
    });

    reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      service: error.service,
      correlator: request.headers.correlator,
      user_id: request.headers.userRegistration,
    });
  }

  return reply.status(500).send({
    message: 'Internal server error',
    error: error.message,
  });
});

fastify.ready(async () => {
  await connectPrisma();
  logger.info('Fastify ready');
});

export const startServer = async () => {
  try {
    await fastify.listen({ port: env.APP_PORT, host: '0.0.0.0' });
    logger.info(`Server listening on ${env.APP_PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
