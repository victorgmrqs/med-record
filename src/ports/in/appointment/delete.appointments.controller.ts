import { DeleteAppointmentUseCase } from 'application/services/appointment/delete.appointments.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';

import { handleError } from '@shared/errors/error.handler';

export class DeleteAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const paramsSchema = (await import('zod')).z.object({
        id: (await import('zod')).z.coerce.number(),
      });
      const { id } = paramsSchema.parse(request.params);

      const deleteAppointmentUseCase = container.resolve(DeleteAppointmentUseCase);
      await deleteAppointmentUseCase.execute(id);

      reply.code(204).send();
    } catch (error: any) {
      return handleError(error, request, reply, DeleteAppointmentController.name);
    }
  }
}
