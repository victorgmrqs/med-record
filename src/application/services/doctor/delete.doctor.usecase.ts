import 'reflect-metadata';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class DeleteDoctorUseCase {
  constructor(
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
  ) {}

  async execute(doctorId: number): Promise<void> {
    const existingDoctor = await this.doctorRepository.findById(doctorId);

    if (!existingDoctor) {
      const message = `No Doctor found with the given id: ${doctorId}`;
      logger.error({
        message: message,
        service: DeleteDoctorUseCase.name,
      });
      throw new AppError(404, 'DOCTOR_NOT_FOUND_ERROR', message, DeleteDoctorUseCase.name);
    }

    await this.doctorRepository.delete(doctorId);
  }
}
