import 'reflect-metadata';
import { UpdateDoctorUseCase } from 'application/services/doctor/update.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

export class UpdateDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const bodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
    });

    try {
      const params = paramsSchema.parse(request.params);
      const id = params.id;
      const body = bodySchema.parse(request.body);

      // Verifica se pelo menos um campo para atualização foi fornecido
      if (Object.keys(body).length === 0) {
        throw new AppError(
          400,
          'INVALID_REQUEST',
          'At least one field must be provided for update',
          UpdateDoctorController.name,
        );
      }

      const updateDoctorUseCase = container.resolve(UpdateDoctorUseCase);
      const doctor = await updateDoctorUseCase.execute({ id, ...body });

      if (!doctor) {
        throw new AppError(404, 'DOCTOR_NOT_FOUND', 'Doctor not found', UpdateDoctorController.name);
      }

      return reply.code(200).send(doctor);
    } catch (error) {
      logger.error({
        message: error.message,
        context: UpdateDoctorController.name,
        error,
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        return reply.code(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'Database conflict. Please try again.',
        });
      }

      if (error instanceof AppError) {
        return reply.code(error.statusCode).send(error);
      }

      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred.',
      });
    }
  }
}
