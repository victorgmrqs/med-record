import 'reflect-metadata';
import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetDoctorUseCase {
  constructor(
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
  ) {}

  async execute(doctorId: number): Promise<DoctorResponseDTO | null> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      return null;
    }

    return doctor.toResponse();
  }
}
