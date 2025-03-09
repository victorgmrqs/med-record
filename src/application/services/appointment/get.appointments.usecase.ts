import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { injectable, inject } from 'tsyringe';

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
      throw new AppError(
        404,
        'APPOINTMENT_NOT_FOUND',
        `No appointment found with the given id: ${id}`,
        'GetAppointmentByIdUseCase',
      );
    }
    return appointment.toResponse();
  }
}
