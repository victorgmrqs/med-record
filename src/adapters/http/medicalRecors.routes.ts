import { FastifyInstance } from 'fastify';
import { CreateMedicalRecordController } from 'ports/in/medicalRecord/create.medicalRecord.controller';
import { GetMedicalRecordController } from 'ports/in/medicalRecord/get.MedicalRecord.controller';
import { GetAllMedicalRecordsController } from 'ports/in/medicalRecord/getAll.medicalRecord.controller';
import { UpdateMedicalRecordController } from 'ports/in/medicalRecord/update.medicalRecord.controller';

import { AuthMiddleware } from '@middlewares/jwt.middleware';

const authMiddleware = new AuthMiddleware();
const getAllMedicalRecordsController = new GetAllMedicalRecordsController();
const createMedicalRecordController = new CreateMedicalRecordController();
const getMedicalRecordController = new GetMedicalRecordController();
const updateMedicalRecordController = new UpdateMedicalRecordController();

export async function medicalRecordRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [authMiddleware.get] }, getAllMedicalRecordsController.handle);
  fastify.get('/:id', { onRequest: [authMiddleware.get] }, getMedicalRecordController.handle);
  fastify.post('/', { onRequest: [authMiddleware.get] }, createMedicalRecordController.handle);
  fastify.put('/:id', { onRequest: [authMiddleware.get] }, updateMedicalRecordController.handle);
}
