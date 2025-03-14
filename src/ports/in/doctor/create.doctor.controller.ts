import 'reflect-metadata';

import { CreateDoctorUseCase } from 'application/services/doctor/create.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { handleError } from '@shared/errors/error.handler';

export class CreateDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: 'Creating a new doctor',
      service: CreateDoctorController.name,
    });
    try {
      const bodySchema = z.object({
        name: z.string(),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6),
      });
      const doctor = bodySchema.parse(request.body);
      const createDoctorUseCase = container.resolve(CreateDoctorUseCase);
      const createdDoctorID = await createDoctorUseCase.execute(doctor);
      reply.code(201).send({ message: 'Doctor created successfully', id: createdDoctorID });
    } catch (error: any) {
      return handleError(error, request, reply, CreateDoctorController.name);
    }
  }
}
