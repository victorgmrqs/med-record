import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetAllDoctorsUseCase {
  constructor(@inject('PrismaDoctorRepository') private doctorRepository: IDoctorRepository) {}

  async execute(): Promise<DoctorResponseDTO[]> {
    const doctorsList = await this.doctorRepository.findAll();
    const formattedDoctors = doctorsList.map((doctor) => {
      return {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
      };
    });
    return formattedDoctors;
  }
}
