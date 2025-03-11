import { IMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.respository.interface';
import { GetAllMedicalRecordsUseCase } from 'application/services/medicalRecord/getAllMedicalRecords.usecase';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';
import { MedicalRecord as MedicalRecordEntity } from 'domain/entities/medicalRecord/medicalRecord';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockMedicalRecordRepository: IMedicalRecordRepository = {
  create: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
};

describe('GetAllMedicalRecordsUseCase', () => {
  let getAllMedicalRecordsUseCase: GetAllMedicalRecordsUseCase;

  beforeEach(() => {
    getAllMedicalRecordsUseCase = new GetAllMedicalRecordsUseCase(mockMedicalRecordRepository);
    vi.clearAllMocks();
  });

  it('should return an empty array when no records exist', async () => {
    vi.spyOn(mockMedicalRecordRepository, 'findAll').mockResolvedValue([]);

    const result = await getAllMedicalRecordsUseCase.execute();

    expect(mockMedicalRecordRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return formatted medical records when records exist', async () => {
    const recordData = {
      id: 1,
      doctorId: 1,
      patientId: 2,
      appointmentId: 3,
      description: 'Observation test',
      createdAt: new Date('2025-03-09T10:00:00.000Z'),
      updatedAt: new Date('2025-03-09T10:00:00.000Z'),
    };

    const recordInstance = new MedicalRecordEntity(
      recordData.id,
      recordData.doctorId,
      recordData.patientId,
      recordData.appointmentId,
      recordData.description,
      recordData.createdAt,
      recordData.updatedAt,
    );
    vi.spyOn(mockMedicalRecordRepository, 'findAll').mockResolvedValue([recordInstance]);

    const result = await getAllMedicalRecordsUseCase.execute();

    const expected = MedicalRecord.mapRecordsToResponse([recordInstance]);

    expect(mockMedicalRecordRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});
