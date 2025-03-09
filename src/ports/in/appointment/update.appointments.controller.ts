import { UpdateAppointmentUseCase } from 'application/services/appointment/update.appointments.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class UpdateAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.info({
      message: 'Starting UpdateAppointmentController.handle',
      service: UpdateAppointmentController.name,
    });

    try {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });
      const { id } = paramsSchema.parse(request.params);

      const bodySchema = z.object({
        doctorId: z.number().optional(),
        patientId: z.number().optional(),
        appointmentDate: z
          .preprocess((arg) => {
            const d = new Date(arg as string);
            return isNaN(d.getTime()) ? undefined : d;
          }, z.instanceof(Date))
          .optional(),
      });
      const bodyData = bodySchema.parse(request.body);

      const updateData = {
        id,
        ...bodyData,
        appointmentDate: bodyData.appointmentDate?.toISOString(),
      };

      const updateAppointmentUseCase = container.resolve(UpdateAppointmentUseCase);
      const updatedAppointment = await updateAppointmentUseCase.execute(updateData);

      reply.code(200).send(updatedAppointment);
    } catch (error: any) {
      return handleError(error, request, reply, UpdateAppointmentController.name);
    }
  }
}
