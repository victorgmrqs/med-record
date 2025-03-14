import { CreateMedicalRecordRequestDTO, UpdateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';

export interface IMedicalRecordRepository {
  findAll(): Promise<MedicalRecord[]>;
  findById(id: number): Promise<MedicalRecord | null>;
  create(data: CreateMedicalRecordRequestDTO): Promise<MedicalRecord>;
  update(data: UpdateMedicalRecordRequestDTO): Promise<MedicalRecord>;
}
