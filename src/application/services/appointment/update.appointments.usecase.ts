import { UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(data: UpdateAppointmentRequestDTO) {
    const existingAppointment = await this.appointmentRepository.findById(data.id);
    if (!existingAppointment) {
      throw new AppError(
        404,
        'APPOINTMENT_NOT_FOUND',
        `No appointment found with the given id: ${data.id}`,
        UpdateAppointmentUseCase.name,
      );
    }

    if (data.appointmentDate == existingAppointment.appointmentDate) {
      return existingAppointment.toResponse();
    }

    // If date is updated, check if it's within business hours and if there's a conflict
    if (data.appointmentDate) {
      const updatedDate = new Date(data.appointmentDate);
      const hour = updatedDate.getHours();
      if (hour < 7 || hour >= 19) {
        throw new AppError(
          400,
          'OUTSIDE_BUSINESS_HOURS',
          'Appointment time must be between 7:00 and 19:00',
          UpdateAppointmentUseCase.name,
        );
      }
      // Check for conflicts using findByDoctorAndDate
      const conflictingAppointments = await this.appointmentRepository.findByDoctorAndDate(
        existingAppointment.doctorId,
        updatedDate,
      );
      const conflict = conflictingAppointments.find((appt) => appt.id !== data.id);
      if (conflict) {
        throw new AppError(
          400,
          'SCHEDULING_CONFLICT',
          'Doctor has another appointment during this time slot',
          UpdateAppointmentUseCase.name,
        );
      }
    }

    const updatedAppointment = await this.appointmentRepository.update(data);
    return updatedAppointment.toResponse();
  }
}
