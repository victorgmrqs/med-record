import 'reflect-metadata';
import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class GetDoctorUseCase {
  constructor(
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
  ) {}

  async execute(doctorId: number): Promise<DoctorResponseDTO> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      const message = `No Doctor found with the given id: ${doctorId}`;
      logger.error({
        message: message,
        service: GetDoctorUseCase.name,
      });
      throw new AppError(404, 'DOCTOR_NOT_FOUND_ERROR', message, GetDoctorUseCase.name);
    }
    const formattedDoctor: DoctorResponseDTO = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
    };
    return formattedDoctor;
  }
}
