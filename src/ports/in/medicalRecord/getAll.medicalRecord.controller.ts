import { GetAllMedicalRecordsUseCase } from 'application/services/medicalRecord/getAllMedicalRecords.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';

import { handleError } from '@shared/errors/error.handler';

export class GetAllMedicalRecordsController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const getAllMedicalRecordsUseCase = container.resolve(GetAllMedicalRecordsUseCase);
      const records = await getAllMedicalRecordsUseCase.execute();
      reply.code(200).send(records);
    } catch (error: any) {
      return handleError(error, request, reply, GetAllMedicalRecordsController.name);
    }
  }
}
