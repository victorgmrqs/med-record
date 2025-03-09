import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError(
        404,
        'APPOINTMENT_NOT_FOUND',
        `No appointment found with the given id: ${id}`,
        DeleteAppointmentUseCase.name,
      );
    }
    await this.appointmentRepository.delete(id);
  }
}
