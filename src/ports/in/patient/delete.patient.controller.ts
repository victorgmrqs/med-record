import 'reflect-metadata';
import { DeletePatientUseCase } from 'application/services/patient/delete.patient.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class DeletePatientController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.info({
      message: 'Delete Patient Controller',
      service: DeletePatientController.name,
    });
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });
    try {
      const params = paramsSchema.parse(request.params);

      const deletePatientUseCase = container.resolve(DeletePatientUseCase);
      await deletePatientUseCase.execute(params.id);
      reply.status(204).send();
    } catch (error: any) {
      return handleError(error, request, reply, DeletePatientController.name);
    }
  }
}
