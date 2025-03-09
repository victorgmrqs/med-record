import { FastifyInstance } from 'fastify';
import { CreateAppointmentController } from 'ports/in/appointment/create.appointments.controller';
import { DeleteAppointmentController } from 'ports/in/appointment/delete.appointments.controller';
import { GetAppointmentController } from 'ports/in/appointment/get.appointments.controller';
import { GetAllAppointmentsController } from 'ports/in/appointment/getAll.appointments.controller';
import { UpdateAppointmentController } from 'ports/in/appointment/update.appointments.controller';

const getAllAppointmentsController = new GetAllAppointmentsController();
const createAppointmentController = new CreateAppointmentController();
const getAppointmentByIdController = new GetAppointmentController();
const deleteAppointmentController = new DeleteAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();

export async function appointmentsRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllAppointmentsController.handle);
  fastify.post('/', createAppointmentController.handle);
  fastify.get('/:id', getAppointmentByIdController.handle);
  fastify.put('/:id', updateAppointmentController.handle);
  fastify.delete('/:id', deleteAppointmentController.handle);
}
