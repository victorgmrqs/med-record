import { MedicalRecordResponseDTO } from 'application/dto/medicalRecord.dto';
import { IMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.respository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class GetMedicalRecordUseCase {
  constructor(
    @inject('MedicalRecordRepository')
    private medicalRecordRepository: IMedicalRecordRepository,
  ) {}

  async execute(id: number): Promise<MedicalRecordResponseDTO | null> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) {
      throw new AppError(
        404,
        'MEDICAL_RECORD_NOT_FOUND',
        `No medical record found with the given id: ${id}`,
        'GetMedicalRecordByIdUseCase',
      );
    }
    return record.toResponse();
  }
}
