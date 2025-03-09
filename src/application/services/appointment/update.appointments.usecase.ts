import { UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
    @inject('PatientRepository')
    private patientRepository: IPatientRepository,
  ) {}

  async execute(
    data: UpdateAppointmentRequestDTO,
  ): Promise<{ id: number; doctorId: number; patientId: number; appointmentDate: string }> {
    const existingAppointment = await this.appointmentRepository.findById(data.id);
    if (!existingAppointment) {
      throw new AppError(
        404,
        'APPOINTMENT_NOT_FOUND',
        `No appointment found with the given id: ${data.id}`,
        'UpdateAppointmentUseCase',
      );
    }

    // If doctorId is updated and different, verify if doctor exists
    if (data.doctorId && data.doctorId !== existingAppointment.doctorId) {
      const doctorExists = await this.doctorRepository.findById(data.doctorId);
      if (!doctorExists) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Doctor not found', 'UpdateAppointmentUseCase');
      }
    }

    // If patientId is updated and different, verify if patient exists
    if (data.patientId && data.patientId !== existingAppointment.patientId) {
      const patientExists = await this.patientRepository.findById(data.patientId);
      if (!patientExists) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Patient not found', 'UpdateAppointmentUseCase');
      }
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
          'UpdateAppointmentUseCase',
        );
      }
      // Check for conflicts using findByDoctorAndDate
      const conflictingAppointments = await this.appointmentRepository.findByDoctorAndDate(
        data.doctorId ?? existingAppointment.doctorId,
        updatedDate,
      );
      const conflict = conflictingAppointments.find((appt) => appt.id !== data.id);
      if (conflict) {
        throw new AppError(
          400,
          'SCHEDULING_CONFLICT',
          'Doctor has another appointment during this time slot',
          'UpdateAppointmentUseCase',
        );
      }
    }

    const updatedAppointment = await this.appointmentRepository.update(data);
    return updatedAppointment.toResponse();
  }
}
