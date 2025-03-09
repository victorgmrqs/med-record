import 'reflect-metadata';

import { UpdatePatientUseCase } from 'application/services/patient/update.patient.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class UpdatePatientController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    logger.info({
      message: 'Update Patient Controller',
      service: UpdatePatientController.name,
    });
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    try {
      const params = paramsSchema.parse(request.params);
      const bodySchema = z.object({
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        birthDate: z.coerce
          .date()
          .refine((date) => date instanceof Date && !isNaN(date.getTime()), { message: 'Invalid date format' })
          .optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
      });
      const body = bodySchema.parse(request.body);

      const updatePatientUseCase = container.resolve(UpdatePatientUseCase);
      const updatedPatient = await updatePatientUseCase.execute({ id: params.id, ...body });
      reply.status(200).send(updatedPatient);
    } catch (error: any) {
      return handleError(error, request, reply, UpdatePatientController.name);
    }
  }
}
