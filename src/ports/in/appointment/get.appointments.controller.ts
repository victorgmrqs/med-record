import { GetAppointmentUseCase } from 'application/services/appointment/get.appointments.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';
import { handleError } from '@shared/errors/error.handler';

export class GetAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });
      const { id } = paramsSchema.parse(request.params);

      const getAppointmentByIdUseCase = container.resolve(GetAppointmentUseCase);
      const appointment = await getAppointmentByIdUseCase.execute(id);

      if (!appointment) {
        const message = `No appointment found with the given id: ${id}`;
        logger.error({ message, service: GetAppointmentController.name });
        throw new AppError(404, 'APPOINTMENT_NOT_FOUND', message, GetAppointmentController.name);
      }

      reply.code(200).send(appointment);
    } catch (error: any) {
      return handleError(error, request, reply, GetAppointmentController.name);
    }
  }
}
