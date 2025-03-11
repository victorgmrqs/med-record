import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockMedicalRecordDBResponse, mockMedicalRecordRepository } from '@tests/mocks/medicalRecord.mock';

import { GetMedicalRecordUseCase } from './get.medicalRecord.usecase';

describe('GetMedicalRecordByIdUseCase', () => {
  let getMedicalRecordByIdUseCase: GetMedicalRecordUseCase;

  beforeEach(() => {
    getMedicalRecordByIdUseCase = new GetMedicalRecordUseCase(mockMedicalRecordRepository);
    vi.clearAllMocks();
  });

  it('should return a formatted medical record when found', async () => {
    const recordData = {
      id: 1,
      doctorId: 1,
      patientId: 2,
      appointmentId: 3,
      description: 'Test observation',
      createdAt: new Date('2020-01-01T16:00:00.000Z'),
      updatedAt: new Date('2020-01-01T16:00:00.000Z'),
    };

    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(mockMedicalRecordDBResponse);

    const result = await getMedicalRecordByIdUseCase.execute(recordData.id);
    expect(mockMedicalRecordRepository.findById).toHaveBeenCalledWith(recordData.id);
    expect(result).toEqual(mockMedicalRecordDBResponse.toResponse());
  });

  it('should throw an error if the medical record is not found', async () => {
    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(null);

    await expect(getMedicalRecordByIdUseCase.execute(999)).rejects.toBeInstanceOf(AppError);
    expect(mockMedicalRecordRepository.findById).toHaveBeenCalledWith(999);
  });
});
