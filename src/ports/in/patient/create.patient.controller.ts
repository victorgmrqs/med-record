import 'reflect-metadata';

import { CreatePatientUseCase } from 'application/services/patient/create.patient.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class CreatePatientController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: 'Creating a new patient',
      service: CreatePatientController.name,
    });
    try {
      const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        phoneNumber: z.string(),
        birthDate: z.string().refine(
          (date) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(date) && !isNaN(new Date(date).getTime());
          },
          { message: 'birthDate must be in the format YYYY-MM-DD' },
        ),
        sex: z.enum(['M', 'F']),
        height: z.number(),
        weight: z.number(),
        doctorId: z.number(),
      });
      const patient = bodySchema.parse(request.body);
      const createPatientUseCase = container.resolve(CreatePatientUseCase);
      const patientID = await createPatientUseCase.execute(patient);

      reply.status(201).send({ message: 'Patient created successfully', id: patientID });
    } catch (error: any) {
      return handleError(error, request, reply, CreatePatientController.name);
    }
  }
}
