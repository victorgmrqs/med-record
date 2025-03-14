import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { injectable, inject } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id);
    const message = 'Appointment not found';
    logger.error({ message, service: DeleteAppointmentUseCase.name });
    if (!appointment) {
      throw new AppError(404, 'APPOINTMENT_NOT_FOUND', message, DeleteAppointmentUseCase.name);
    }
    await this.appointmentRepository.delete(id);
  }
}
