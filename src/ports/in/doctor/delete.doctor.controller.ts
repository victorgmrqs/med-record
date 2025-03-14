import 'reflect-metadata';
import { DeleteDoctorUseCase } from 'application/services/doctor/delete.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class DeleteDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: 'Deleting a doctor',
      service: DeleteDoctorController.name,
    });
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    try {
      const { id } = paramsSchema.parse(request.params);

      const deleteDoctorUseCase = container.resolve(DeleteDoctorUseCase);
      await deleteDoctorUseCase.execute(id);

      return reply.code(204).send();
    } catch (error: any) {
      return handleError(error, request, reply, DeleteDoctorController.name);
    }
  }
}
