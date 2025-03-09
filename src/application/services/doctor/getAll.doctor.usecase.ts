import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { Doctor } from 'domain/entities/doctor/doctor';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetAllDoctorsUseCase {
  constructor(@inject('DoctorRepository') private doctorRepository: IDoctorRepository) {}

  async execute(): Promise<DoctorResponseDTO[]> {
    const doctors = await this.doctorRepository.findAll();

    const formattedDoctors = Doctor.toArrayResponse(doctors);
    return formattedDoctors;
  }
}
