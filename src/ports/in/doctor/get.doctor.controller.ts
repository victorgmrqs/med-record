import { GetDoctorUseCase } from 'application/services/doctor/get.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z, ZodError } from 'zod';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';
import { handleError } from '@shared/errors/error.handler';

export class GetDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: 'Getting a doctor by ID',
      service: GetDoctorController.name,
    });
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    try {
      const { id } = paramsSchema.parse(request.params);
      const getDoctorUseCase = container.resolve(GetDoctorUseCase);
      const doctor = await getDoctorUseCase.execute(id);

      return reply.code(200).send(doctor);
    } catch (error: any) {
      return handleError(error, request, reply, GetDoctorController.name);
    }
  }
}
