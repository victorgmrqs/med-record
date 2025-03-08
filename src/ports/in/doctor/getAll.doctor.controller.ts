import 'reflect-metadata';

import { GetAllDoctorsUseCase } from 'application/services/doctor/getAll.doctor.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

import logger from '@infra/logger';

export class GetAllDoctorsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    logger.info({
      message: 'Get All Doctors Controller',
      service: GetAllDoctorsController.name,
    });
    const getAllDoctorsUseCase = container.resolve(GetAllDoctorsUseCase);
    const doctors = await getAllDoctorsUseCase.execute();

    reply.code(200).send(doctors);
  }
}
