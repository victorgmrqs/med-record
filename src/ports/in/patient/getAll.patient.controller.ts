import { GetAllPatientsUseCase } from 'application/services/patient/getAll.patient.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

import logger from '@infra/logger';

export class GetAllPatientsController {
  async handle(request: FastifyRequest, response: FastifyReply): Promise<Response> {
    logger.info({
      message: 'Get All Patients Controller',
      service: GetAllPatientsController.name,
    });
    const getAllPatientsUseCase = container.resolve(GetAllPatientsUseCase);
    const patients = await getAllPatientsUseCase.execute();
    return response.status(200).send(patients);
  }
}
