import { GetPatientUseCase } from 'application/services/patient/get.patient.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class GetPatientController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: 'Get Patient Controller',
      service: GetPatientController.name,
    });
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });
    try {
      const { id } = paramsSchema.parse(request.params);
      const getPatientUseCase = container.resolve(GetPatientUseCase);
      const patient = await getPatientUseCase.execute(id);
      reply.status(200).send(patient);
    } catch (error: any) {
      return handleError(error, request, reply, GetPatientController.name);
    }
  }
}
