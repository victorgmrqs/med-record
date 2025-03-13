import '@shared/container';
import { connectPrisma, prismaPlugin } from 'adapters/database/prisma/client';
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import logger from 'infra/logger';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { ZodError } from 'zod';

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { env } from '@infra/env';
import AppError from '@shared/errors/AppError';

import routes from './index.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: true,
});

fastify.register(prismaPlugin);
fastify.register(helmet);
fastify.register(cors, {
  origin: true,
});

const swaggerOptions: SwaggerOptions = {
  mode: 'static',
  specification: {
    baseDir: __dirname,
    path: 'src/swagger.json',
    postProcessor: (swaggerObject) => swaggerObject,
  },
};

const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
};

fastify.register(routes, { prefix: '/api/v1' });
fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
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
    });

    return reply.status(error.statusCode).send({
      code: error.code,
      message: error.message,
      service: error.service,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation error',
      details: error.validation,
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
