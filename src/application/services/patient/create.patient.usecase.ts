import { PatientRequestDTO } from 'application/dto/patient.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class CreatePatientUseCase {
  constructor(
    @inject('PatientRepository') private patientRepository: IPatientRepository,
    @inject('DoctorRepository') private doctorRepository: IDoctorRepository,
  ) {}

  async execute(patient: PatientRequestDTO): Promise<number> {
    const patientExists = await this.patientRepository.findByEmail(patient.email);
    if (patientExists) {
      const message = 'Patient already exists';
      logger.error({
        message: message,
        service: CreatePatientUseCase.name,
      });
      throw new AppError(400, 'VALIDATION_ERROR', message, CreatePatientUseCase.name);
    }
    const doctorExists = await this.doctorRepository.findById(patient.doctorId);
    if (!doctorExists) {
      const message = 'Doctor not found';
      logger.error({ message, service: CreatePatientUseCase.name });
      throw new AppError(400, 'VALIDATION_ERROR', message, CreatePatientUseCase.name);
    }
    const createdPatient = await this.patientRepository.create(patient);
    return createdPatient.id;
  }
}
