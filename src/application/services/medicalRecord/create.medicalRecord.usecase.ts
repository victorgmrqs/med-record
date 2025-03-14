import { CreateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.repository.interface';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class CreateMedicalRecordUseCase {
  constructor(
    @inject('MedicalRecordRepository')
    private medicalRecordRepository: IMedicalRecordRepository,
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
    @inject('PatientRepository')
    private patientRepository: IPatientRepository,
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(data: CreateMedicalRecordRequestDTO): Promise<number> {
    const doctor = await this.doctorRepository.findById(data.doctorId);
    if (!doctor) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Doctor not found', 'CreateMedicalRecordUseCase');
    }

    const patient = await this.patientRepository.findById(data.patientId);
    if (!patient) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Patient not found', 'CreateMedicalRecordUseCase');
    }

    const appointment = await this.appointmentRepository.findById(data.appointmentId);
    if (!appointment) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Appointment not found', 'CreateMedicalRecordUseCase');
    }

    if (appointment.doctorId !== data.doctorId || appointment.patientId !== data.patientId) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Appointment does not match the provided doctor and patient',
        'CreateMedicalRecordUseCase',
      );
    }

    const record = await this.medicalRecordRepository.create(data);
    return record.id;
  }
}
