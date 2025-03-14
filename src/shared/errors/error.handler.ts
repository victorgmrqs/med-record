import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import logger from '@infra/logger';

import AppError from './AppError';
export function handleError(error: any, request: FastifyRequest, reply: FastifyReply, service: string) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      service,
      fields: error.issues.map((issue) => issue.path.join('.')).filter(Boolean),
      issues: error.issues,
    });
  }

  if (error instanceof AppError) {
    logger.error({
      code: error.code,
      message: error.message,
      service,
      correlator: request.headers.correlator,
      user_id: request.headers.userRegistration,
    });
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      service,
      correlator: request.headers.correlator,
      user_id: request.headers.userRegistration,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation error',
      details: error.validation,
    });
  }

  logger.error({
    message: error.message,
    code: 'INTERNAL_SERVER_ERROR',
    service,
    error,
  });
  return reply.status(500).send({
    message: 'Internal server error',
  });
}
