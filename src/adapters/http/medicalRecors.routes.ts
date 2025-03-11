import { FastifyInstance } from 'fastify';
import { CreateMedicalRecordController } from 'ports/in/medicalRecord/create.medicalRecord.controller';
import { GetMedicalRecordController } from 'ports/in/medicalRecord/get.MedicalRecord.controller';
import { GetAllMedicalRecordsController } from 'ports/in/medicalRecord/getAll.medicalRecord.controller';
import { UpdateMedicalRecordController } from 'ports/in/medicalRecord/update.medicalRecord.controller';

const getAllMedicalRecordsController = new GetAllMedicalRecordsController();
const createMedicalRecordController = new CreateMedicalRecordController();
const getMedicalRecordController = new GetMedicalRecordController();
const updateMedicalRecordController = new UpdateMedicalRecordController();

export async function medicalRecordRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllMedicalRecordsController.handle);
  fastify.get('/:id', getMedicalRecordController.handle);
  fastify.post('/', createMedicalRecordController.handle);
  fastify.put('/:id', updateMedicalRecordController.handle);
}
