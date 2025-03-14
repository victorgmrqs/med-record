import { FastifyInstance } from 'fastify';
import { CreateAppointmentController } from 'ports/in/appointment/create.appointments.controller';
import { DeleteAppointmentController } from 'ports/in/appointment/delete.appointments.controller';
import { GetAppointmentController } from 'ports/in/appointment/get.appointments.controller';
import { GetAllAppointmentsController } from 'ports/in/appointment/getAll.appointments.controller';
import { UpdateAppointmentController } from 'ports/in/appointment/update.appointments.controller';

import { AuthMiddleware } from '@middlewares/jwt.middleware';

const authMiddleware = new AuthMiddleware();
const getAllAppointmentsController = new GetAllAppointmentsController();
const createAppointmentController = new CreateAppointmentController();
const getAppointmentByIdController = new GetAppointmentController();
const deleteAppointmentController = new DeleteAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();

export async function appointmentsRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [authMiddleware.get] }, getAllAppointmentsController.handle);
  fastify.post('/', { onRequest: [authMiddleware.get] }, createAppointmentController.handle);
  fastify.get('/:id', { onRequest: [authMiddleware.get] }, getAppointmentByIdController.handle);
  fastify.put('/:id', { onRequest: [authMiddleware.get] }, updateAppointmentController.handle);
  fastify.delete('/:id', { onRequest: [authMiddleware.get] }, deleteAppointmentController.handle);
}
