import 'reflect-metadata';
import { CreateAppointmentsUseCase } from 'application/services/appointment/create.appointments.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class CreateAppointmentController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const bodySchema = z.object({
        doctorId: z.number(),
        patientId: z.number(),
        appointmentDate: z.preprocess((arg) => {
          const d = new Date(arg as string);
          return isNaN(d.getTime()) ? undefined : d;
        }, z.instanceof(Date)),
      });
      const parsedData = bodySchema.parse(request.body);

      const appointmentData = {
        doctorId: parsedData.doctorId,
        patientId: parsedData.patientId,
        appointmentDate: parsedData.appointmentDate.toISOString(),
      };

      const createAppointmentsUseCase = container.resolve(CreateAppointmentsUseCase);
      const appointmentId = await createAppointmentsUseCase.execute(appointmentData);

      logger.info({
        message: 'Appointment created successfully',
        service: CreateAppointmentController.name,
      });
      reply.code(201).send({ message: 'Appointment created successfully', id: appointmentId });
    } catch (error: any) {
      return handleError(error, request, reply, CreateAppointmentController.name);
    }
  }
}
