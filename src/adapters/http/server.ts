import '@shared/container';
import { connectPrisma, prismaPlugin } from 'adapters/database/prisma/client';
import Fastify from 'fastify';

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { env } from '@infra/env';
import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

import routes from './index.routes';

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
    baseDir: process.cwd(),
    path: 'src/swagger.json',
    postProcessor: (swaggerObject) => swaggerObject,
  },
};

const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
};

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

fastify.register(routes, { prefix: '/api/v1' });

fastify.setErrorHandler((error, request, reply) => {
  return handleError(error, request, reply, 'GlobalErrorHandler');
});

fastify.ready(async () => {
  await connectPrisma();
  logger.info('Fastify ready');
});

export const startServer = async () => {
  try {
    await fastify.listen({ port: env.APP_PORT, host: '0.0.0.0' });
    logger.info(`Server listening on port ${env.APP_PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
