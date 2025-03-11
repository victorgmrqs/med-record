import { CreateMedicalRecordUseCase } from 'application/services/medicalRecord/create.medicalRecord.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class CreateMedicalRecordController {
  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const bodySchema = z.object({
        doctorId: z.number(),
        patientId: z.number(),
        appointmentId: z.number(),
        diagnosis: z.string().min(1),
        prescription: z.string().min(1),
        notes: z.string().min(1),
      });
      const recordData = bodySchema.parse(request.body);

      const createMedicalRecordUseCase = container.resolve(CreateMedicalRecordUseCase);
      const recordId = await createMedicalRecordUseCase.execute(recordData);

      logger.info({
        message: 'Medical record created successfully',
        service: CreateMedicalRecordController.name,
      });
      reply.code(201).send({ message: 'Medical record created successfully', id: recordId });
    } catch (error: any) {
      return handleError(error, request, reply, CreateMedicalRecordController.name);
    }
  }
}
