import { UpdateMedicalRecordUseCase } from 'application/services/medicalRecord/update.medicalRecord.usecase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class UpdateMedicalRecordController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const bodySchema = z.object({
        id: z.number(),
        doctorId: z.number().optional(),
        patientId: z.number().optional(),
        appointmentId: z.number().optional(),
        diagnosis: z.string().min(1).optional(),
        notes: z.string().min(1).optional(),
        prescription: z.string().min(1).optional(),
      });
      const updateData = bodySchema.parse(request.body);

      const updateUseCase = container.resolve(UpdateMedicalRecordUseCase);
      const updatedRecord = await updateUseCase.execute(updateData);

      logger.info({
        message: 'Medical record updated successfully',
        service: UpdateMedicalRecordController.name,
      });
      reply.code(200).send(updatedRecord);
    } catch (error: any) {
      return handleError(error, request, reply, UpdateMedicalRecordController.name);
    }
  }
}
