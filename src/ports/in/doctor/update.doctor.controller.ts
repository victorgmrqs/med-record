import { UpdateDoctorUseCase } from 'application/services/doctor/update.doctor.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class UpdateDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: `Starting ${UpdateDoctorController.name}`,
      service: UpdateDoctorController.name,
    });

    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const bodySchema = z.object({
      name: z.string().optional(),
    });

    try {
      const params = paramsSchema.parse(request.params);
      const id = params.id;
      const body = bodySchema.parse(request.body);

      const updateData = { id, ...body };

      const updateDoctorUseCase = container.resolve(UpdateDoctorUseCase);
      const doctor = await updateDoctorUseCase.execute(updateData);

      logger.info({
        message: `Finishing ${UpdateDoctorController.name}`,
        service: UpdateDoctorController.name,
      });
      return reply.code(200).send(doctor);
    } catch (error: any) {
      return handleError(error, request, reply, UpdateDoctorController.name);
    }
  }
}
