import 'reflect-metadata';
import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { Doctor } from 'domain/entities/doctor';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetDoctorUseCase {
  constructor(
    @inject('PrismaDoctorRepository')
    private doctorRepository: IDoctorRepository,
  ) {}

  async execute(doctorId: number): Promise<DoctorResponseDTO | null> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      return null;
    }
    const formattedDoctor: DoctorResponseDTO = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
    };
    return formattedDoctor;
  }
}
