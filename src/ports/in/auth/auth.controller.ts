import { LoginUseCase } from 'application/services/auth/login.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class AuthController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });
      const credentials = bodySchema.parse(request.body);
      const loginUseCase = container.resolve(LoginUseCase);
      const { token } = await loginUseCase.execute(credentials);

      logger.info({
        message: 'User logged in successfully',
        service: AuthController.name,
      });
      reply.code(200).send({ token });
    } catch (error: any) {
      return handleError(error, request, reply, AuthController.name);
    }
  }
}
