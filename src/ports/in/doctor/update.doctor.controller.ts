import 'reflect-metadata';
import { UpdateDoctorUseCase } from 'application/services/doctor/update.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import AppError from '@shared/errors/AppError';
import { handleError } from '@shared/errors/error.handler';

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

      // if (!doctor) {
      // throw new AppError(404, 'DOCTOR_NOT_FOUND', 'Doctor not found', UpdateDoctorController.name);
      // }

      reply.code(200).send(doctor);
    } catch (error) {
      return handleError(error, request, reply, UpdateDoctorController.name);
    }
  }
}
