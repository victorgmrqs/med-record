import { UpdateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.repository.interface';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class UpdateMedicalRecordUseCase {
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

  async execute(data: UpdateMedicalRecordRequestDTO) {
    const existingRecord = await this.medicalRecordRepository.findById(data.id);
    if (!existingRecord) {
      throw new AppError(404, 'MEDICAL_RECORD_NOT_FOUND', 'No medical record found', UpdateMedicalRecordUseCase.name);
    }

    if (data.doctorId && data.doctorId !== existingRecord.doctorId) {
      const doctor = await this.doctorRepository.findById(data.doctorId);
      if (!doctor) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Doctor not found', UpdateMedicalRecordUseCase.name);
      }
    }

    if (data.patientId && data.patientId !== existingRecord.patientId) {
      const patient = await this.patientRepository.findById(data.patientId);
      if (!patient) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Patient not found', UpdateMedicalRecordUseCase.name);
      }
    }

    if (data.appointmentId && data.appointmentId !== existingRecord.appointmentId) {
      const appointment = await this.appointmentRepository.findById(data.appointmentId);
      if (!appointment) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Appointment not found', UpdateMedicalRecordUseCase.name);
      }
      const effectiveDoctorId = data.doctorId || existingRecord.doctorId;
      const effectivePatientId = data.patientId || existingRecord.patientId;
      if (appointment.doctorId !== effectiveDoctorId || appointment.patientId !== effectivePatientId) {
        throw new AppError(
          400,
          'VALIDATION_ERROR',
          'Appointment does not match the provided doctor and patient',
          UpdateMedicalRecordUseCase.name,
        );
      }
    }

    if (!data.appointmentId && (data.doctorId || data.patientId)) {
      const effectiveDoctorId = data.doctorId || existingRecord.doctorId;
      const effectivePatientId = data.patientId || existingRecord.patientId;
      const appointment = await this.appointmentRepository.findById(existingRecord.appointmentId);
      if (!appointment || appointment.doctorId !== effectiveDoctorId || appointment.patientId !== effectivePatientId) {
        throw new AppError(
          400,
          'VALIDATION_ERROR',
          'Appointment does not match the provided doctor and patient',
          UpdateMedicalRecordUseCase.name,
        );
      }
    }

    const updatedRecord = await this.medicalRecordRepository.update(data);
    return updatedRecord.toResponse();
  }
}
