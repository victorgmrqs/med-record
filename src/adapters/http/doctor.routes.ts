import { FastifyInstance } from 'fastify';
import { CreateDoctorController } from 'ports/in/doctor/create.doctor.controller';
import { DeleteDoctorController } from 'ports/in/doctor/delete.doctor.controller';
import { GetDoctorController } from 'ports/in/doctor/get.doctor.controller';
import { GetAllDoctorsController } from 'ports/in/doctor/getAll.doctor.controller';
import { UpdateDoctorController } from 'ports/in/doctor/update.doctor.controller';

import { AuthMiddleware } from '@middlewares/jwt.middleware';

const authMiddleware = new AuthMiddleware();
const createDoctorController = new CreateDoctorController();
const getAllDoctorsController = new GetAllDoctorsController();
const getDoctorController = new GetDoctorController();
const updateDoctorController = new UpdateDoctorController();
const deleteDoctorController = new DeleteDoctorController();

export async function doctorRoutes(fastify: FastifyInstance) {
  fastify.post('/', createDoctorController.handle);
  fastify.get('/', { onRequest: [authMiddleware.get] }, getAllDoctorsController.handle);
  fastify.get('/:id', { onRequest: [authMiddleware.get] }, getDoctorController.handle);
  fastify.put('/:id', { onRequest: [authMiddleware.get] }, updateDoctorController.handle);
  fastify.delete('/:id', { onRequest: [authMiddleware.get] }, deleteDoctorController.handle);
}
