import 'reflect-metadata';
import { DeleteDoctorUseCase } from 'application/services/doctor/delete.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

import logger from '@infra/logger';
import { Prisma } from '@prisma/client';
import AppError from '@shared/errors/AppError';

export class DeleteDoctorController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    // try {
    const { id } = paramsSchema.parse(request.params);

    const deleteDoctorUseCase = container.resolve(DeleteDoctorUseCase);
    await deleteDoctorUseCase.execute(id);

    // Retorna 204 No Content em caso de exclusão bem-sucedida
    return reply.code(204).send();
  }
  // catch (error: any) {
  // logger.error({
  // message: error.message,
  // context: DeleteDoctorController.name,
  // error,
  // });

  // if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //   // Tratamento para diferentes erros do Prisma
  //   switch (error.code) {
  //     case 'P2025': // Registro não encontrado
  //       return reply.code(404).send({
  //         statusCode: 404,
  //         error: 'Not Found',
  //         message: 'Doctor not found',
  //       });
  //     case 'P2003': // Violação de chave estrangeira
  //       return reply.code(409).send({
  //         statusCode: 409,
  //         error: 'Conflict',
  //         message: 'Cannot delete doctor as it has related records',
  //       });
  //     default:
  //       break;
  //   }
  // }

  // if (error instanceof AppError) {
  // return reply.code(error.statusCode).send(error);
  // }

  // return reply.code(500).send({
  // statusCode: 500,
  // error: 'Internal Server Error',
  // message: 'An unexpected error occurred while deleting the doctor',
  // });
  // }
  // }
}
