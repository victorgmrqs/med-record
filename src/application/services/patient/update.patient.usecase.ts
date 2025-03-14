import 'reflect-metadata';
import { PatientResponseDTO, UpdatePatientRequestDTO } from 'application/dto/patient.dto';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class UpdatePatientUseCase {
  constructor(
    @inject('PatientRepository')
    private patientRepository: IPatientRepository,
  ) {}

  async execute(data: UpdatePatientRequestDTO): Promise<PatientResponseDTO | null> {
    logger.info({
      message: 'Update Patient Use Case',
      service: UpdatePatientUseCase.name,
    });
    const existingPatient = await this.patientRepository.findById(data.id);

    if (!existingPatient) {
      const message = `No patient found with the given id: ${data.id}`;
      logger.error({
        message: message,
        service: UpdatePatientUseCase.name,
      });
      throw new AppError(404, 'PATIENT_NOT_FOUND_ERROR', message, UpdatePatientUseCase.name);
    }

    const { doctorId, ...updateData } = data;
    existingPatient.updateWith(updateData);

    const updatedPatient = await this.patientRepository.update(existingPatient);
    return updatedPatient.toResponse();
  }
}
