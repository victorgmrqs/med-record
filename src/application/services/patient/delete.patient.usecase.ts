import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class DeletePatientUseCase {
  constructor(@inject('PatientRepository') private patientRepository: IPatientRepository) {}

  async execute(id: number): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      const message = `No patient found with the given id: ${id}`;
      logger.error({
        message: message,
        service: DeletePatientUseCase.name,
      });
      throw new AppError(404, 'PATIENT_NOT_FOUND_ERROR', message, DeletePatientUseCase.name);
    }

    await this.patientRepository.delete(id);
  }
}
