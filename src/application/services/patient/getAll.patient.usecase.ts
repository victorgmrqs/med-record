import { PatientResponseDTO } from 'application/dto/patient.dto';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { Patient } from 'domain/entities/patient/patient';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetAllPatientsUseCase {
  constructor(
    @inject('PatientRepository')
    private patientRepository: IPatientRepository,
  ) {}

  async execute(): Promise<PatientResponseDTO[]> {
    const patients = await this.patientRepository.findAll();
    return Patient.toArrayResponse(patients);
  }
}
