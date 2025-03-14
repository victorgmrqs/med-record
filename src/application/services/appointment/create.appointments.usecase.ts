import { CreateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class CreateAppointmentsUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
    @inject('PatientRepository')
    private patientRepository: IPatientRepository,
  ) {}

  async execute(appointment: CreateAppointmentRequestDTO): Promise<number> {
    logger.info({
      message: 'Creating appointment',
      service: CreateAppointmentsUseCase.name,
    });

    const doctorExists = await this.doctorRepository.findById(appointment.doctorId);
    if (!doctorExists) {
      const message = 'Doctor not found';
      logger.error({ message, service: CreateAppointmentsUseCase.name });
      throw new AppError(400, 'VALIDATION_ERROR', message, CreateAppointmentsUseCase.name);
    }

    const patientExists = await this.patientRepository.findById(appointment.patientId);
    if (!patientExists) {
      const message = 'Patient not found';
      logger.error({ message, service: CreateAppointmentsUseCase.name });
      throw new AppError(400, 'VALIDATION_ERROR', message, CreateAppointmentsUseCase.name);
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const appointmentHour = appointmentDate.getHours();
    if (appointmentHour < 7 || appointmentHour >= 19) {
      const message = 'Appointment time must be between 7:00 and 19:00';
      logger.error({ message, service: CreateAppointmentsUseCase.name });
      throw new AppError(400, 'OUTSIDE_BUSINESS_HOURS', message, CreateAppointmentsUseCase.name);
    }

    const appointmentStart = appointmentDate;
    const appointmentEnd = new Date(appointmentDate.getTime() + 60 * 60 * 1000);

    const isAvailable = await this.appointmentRepository.isDoctorAvailable(
      appointment.doctorId,
      appointmentStart,
      appointmentEnd,
    );
    if (!isAvailable) {
      const message = 'Doctor has another appointment during this time slot';
      logger.error({ message, service: CreateAppointmentsUseCase.name });
      throw new AppError(400, 'SCHEDULING_CONFLICT', message, CreateAppointmentsUseCase.name);
    }

    const createdAppointment = await this.appointmentRepository.create(appointment);
    return createdAppointment.id;
  }
}
