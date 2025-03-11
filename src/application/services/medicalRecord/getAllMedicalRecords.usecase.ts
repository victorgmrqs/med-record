import { IMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.respository.interface';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';
import { injectable, inject } from 'tsyringe';

@injectable()
export class GetAllMedicalRecordsUseCase {
  constructor(
    @inject('MedicalRecordRepository')
    private medicalRecordRepository: IMedicalRecordRepository,
  ) {}

  async execute(): Promise<
    {
      id: number;
      doctorId: number;
      patientId: number;
      appointmentId: number;
      description: string;
      createdAt?: Date;
      updatedAt?: Date;
    }[]
  > {
    const records = await this.medicalRecordRepository.findAll();
    return MedicalRecord.mapRecordsToResponse(records);
  }
}
