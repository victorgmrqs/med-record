import { IDoctorDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IHashRepository } from 'application/repositories/hash/crypto.repository.interface';
import { inject, injectable } from 'tsyringe';

import logger from '@infra/logger';
import AppError from '@shared/errors/AppError';

@injectable()
export class CreateDoctorUseCase {
  constructor(
    @inject('DoctorRepository') private doctorRepository: IDoctorRepository,
    @inject('HashRepository') private hashRepository: IHashRepository,
  ) {}

  async execute(doctor: IDoctorDTO): Promise<number> {
    const doctorExists = await this.doctorRepository.findByEmail(doctor.email);
    if (doctorExists) {
      const message = 'Doctor already exists';
      logger.error({
        message: message,
        service: CreateDoctorUseCase.name,
      });
      throw new AppError(400, 'VALIDATION_ERROR', message, CreateDoctorUseCase.name);
    }
    if (!doctor.password) {
      const message = 'Password is required';
      logger.error({
        message: message,
        service: CreateDoctorUseCase.name,
      });
      throw new AppError(400, 'VALIDATION_ERROR', message, CreateDoctorUseCase.name);
    }
    const hashedPassword = await this.hashRepository.hash(doctor.password);
    doctor.password = hashedPassword;

    const createdDoctor = await this.doctorRepository.create(doctor);
    return createdDoctor.id;
  }
}
