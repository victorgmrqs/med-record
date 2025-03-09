import { PatientRequestDTO, PatientResponseDTO, UpdatePatientRequestDTO } from 'application/dto/patient.dto';
import { Patient } from 'domain/entities/patient/patient';

export interface IPatientRepository {
  findAll(): Promise<Patient[]>;
  findById(id: number): Promise<Patient | null>;
  findByEmail(email: string): Promise<Boolean | null>;
  update(patient: UpdatePatientRequestDTO): Promise<Patient>;
  create(patient: PatientRequestDTO): Promise<Patient>;
  delete(id: number): Promise<void>;
}
