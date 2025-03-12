import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

import { env } from '@infra/env';
import AppError from '@shared/errors/AppError';

export class AuthMiddleware {
  get(request: FastifyRequest, reply: FastifyReply, done: (err?: any) => void): void {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return done(new AppError(401, 'UNAUTHORIZED', 'Missing token', AuthMiddleware.name));
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return done(new AppError(401, 'UNAUTHORIZED', 'Invalid token format', AuthMiddleware.name));
      }

      const token = parts[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      request.user = decoded;
      done();
    } catch (error: any) {
      return done(new AppError(401, 'UNAUTHORIZED', error.message || 'Invalid token', AuthMiddleware.name));
    }
  }
}
