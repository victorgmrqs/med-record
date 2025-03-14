import 'reflect-metadata';
import { DoctorResponseDTO, IUpdateDoctorRequestDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class UpdateDoctorUseCase {
  constructor(
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
  ) {}

  async execute(data: IUpdateDoctorRequestDTO): Promise<DoctorResponseDTO | null> {
    const existingDoctor = await this.doctorRepository.findById(data.id);

    if (!existingDoctor) {
      const message = 'Doctor not found';
      logger.error({
        message: message,
        service: UpdateDoctorUseCase.name,
      });
      throw new AppError(404, 'DOCTOR_NOT_FOUND_ERROR', message, UpdateDoctorUseCase.name);
    }

    const updatedDoctor = await this.doctorRepository.update(data);

    return updatedDoctor.toResponse();
  }
}
