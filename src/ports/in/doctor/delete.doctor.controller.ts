import 'reflect-metadata';
import { DeleteDoctorUseCase } from 'application/services/doctor/delete.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import { handleError } from '@shared/errors/error.handler';

export class DeleteDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    try {
      const { id } = paramsSchema.parse(request.params);

      const deleteDoctorUseCase = container.resolve(DeleteDoctorUseCase);
      await deleteDoctorUseCase.execute(id);

      // Retorna 204 No Content em caso de exclusão bem-sucedida
      return reply.code(204).send();
    } catch (error: any) {
      return handleError(error, request, reply, DeleteDoctorController.name);
    }
  }
}
