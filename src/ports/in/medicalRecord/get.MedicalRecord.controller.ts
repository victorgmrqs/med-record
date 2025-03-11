import { GetMedicalRecordUseCase } from 'application/services/medicalRecord/get.medicalRecord.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import { handleError } from '@shared/errors/error.handler';

export class GetMedicalRecordController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });
      const { id } = paramsSchema.parse(request.params);

      const getMedicalRecordByIdUseCase = container.resolve(GetMedicalRecordUseCase);
      const record = await getMedicalRecordByIdUseCase.execute(id);

      reply.code(200).send(record);
    } catch (error: any) {
      return handleError(error, request, reply, GetMedicalRecordController.name);
    }
  }
}
