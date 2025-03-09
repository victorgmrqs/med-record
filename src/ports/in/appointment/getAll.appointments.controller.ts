import 'reflect-metadata';

import { GetAllAppointmentsUseCase } from 'application/services/appointment/getAll.appointments.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';

import { handleError } from '@shared/errors/error.handler';

export class GetAllAppointmentsController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const getAllAppointmentsUseCase = container.resolve(GetAllAppointmentsUseCase);

      const appointments = await getAllAppointmentsUseCase.execute();
      reply.code(200).send(appointments);
    } catch (error: any) {
      return handleError(error, request, reply, GetAllAppointmentsController.name);
    }
  }
}
