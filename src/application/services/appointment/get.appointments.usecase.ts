import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { injectable, inject } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class GetAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: number): Promise<{ id: number; doctorId: number; patientId: number; appointmentDate: string }> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      const message = 'Appointment not found';
      logger.error({ message, service: GetAppointmentUseCase.name });
      throw new AppError(404, 'APPOINTMENT_NOT_FOUND', message, GetAppointmentUseCase.name);
    }
    return appointment.toResponse();
  }
}
