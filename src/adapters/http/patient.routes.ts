import { FastifyInstance } from 'fastify';
import { CreatePatientController } from 'ports/in/patient/create.patient.controller';
import { DeletePatientController } from 'ports/in/patient/delete.patient.controller';
import { GetPatientController } from 'ports/in/patient/get.patient.controller';
import { GetAllPatientsController } from 'ports/in/patient/getAll.patient.controller';
import { UpdatePatientController } from 'ports/in/patient/update.patient.controller';

import { AuthMiddleware } from '@middlewares/jwt.middleware';

const authMiddleware = new AuthMiddleware();
const getAllPatientsController = new GetAllPatientsController();
const getPatientController = new GetPatientController();
const createPatientController = new CreatePatientController();
const updatePatientController = new UpdatePatientController();
const deletePatientController = new DeletePatientController();

export async function patientsRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [authMiddleware.get] }, getAllPatientsController.handle);
  fastify.get('/:id', { onRequest: [authMiddleware.get] }, getPatientController.handle);
  fastify.post('/', { onRequest: [authMiddleware.get] }, createPatientController.handle);
  fastify.put('/:id', { onRequest: [authMiddleware.get] }, updatePatientController.handle);
  fastify.delete('/:id', { onRequest: [authMiddleware.get] }, deletePatientController.handle);
}
