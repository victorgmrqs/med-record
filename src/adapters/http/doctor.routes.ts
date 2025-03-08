import { FastifyInstance } from 'fastify';
import { CreateDoctorController } from 'ports/in/doctor/create.doctor.controller';
import { DeleteDoctorController } from 'ports/in/doctor/delete.doctor.controller';
import { GetDoctorController } from 'ports/in/doctor/get.doctor.controller';
import { GetAllDoctorsController } from 'ports/in/doctor/getAll.doctor.controller';
import { UpdateDoctorController } from 'ports/in/doctor/update.doctor.controller';

const createDoctorController = new CreateDoctorController();
const getAllDoctorsController = new GetAllDoctorsController();
const getDoctorController = new GetDoctorController();
const updateDoctorController = new UpdateDoctorController();
const deleteDoctorController = new DeleteDoctorController();

export async function doctorRoutes(fastify: FastifyInstance) {
  fastify.post('/', createDoctorController.handle);
  fastify.get('/', getAllDoctorsController.handle);
  fastify.get('/:id', getDoctorController.handle);
  fastify.put('/:id', updateDoctorController.handle);
  fastify.delete('/:id', deleteDoctorController.handle);
}
