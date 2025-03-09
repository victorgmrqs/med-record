import 'reflect-metadata';
import { UpdatePatientRequestDTO } from 'application/dto/patient.dto';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import {
  mockFemalePatientDBResponse,
  mockFemalePatientInputDataToUpdate,
  mockMalePatientDBResponse,
  mockPatientRepository,
  mockUpdatedFemalePatient,
  mockUpdatedMalePatient,
} from '@tests/mocks/patient.mocks';

import { UpdatePatientUseCase } from './update.patient.usecase';

describe('UpdatePatientUseCase', () => {
  let updatePatientUseCase: UpdatePatientUseCase;

  beforeEach(() => {
    updatePatientUseCase = new UpdatePatientUseCase(mockPatientRepository);
    vi.clearAllMocks();
  });

  it('should update the patient successfully', async () => {
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockFemalePatientDBResponse);
    vi.spyOn(mockPatientRepository, 'update').mockResolvedValue(mockUpdatedFemalePatient);

    const result = await updatePatientUseCase.execute(mockFemalePatientInputDataToUpdate);

    expect(mockPatientRepository.findById).toHaveBeenCalledWith(mockFemalePatientInputDataToUpdate.id);
    expect(mockPatientRepository.update).toHaveBeenCalledWith(mockFemalePatientDBResponse);
    expect(result).toEqual(mockUpdatedFemalePatient.toResponse());
  });

  it('should return 404 when the patient does not exist', async () => {
    const updateData: UpdatePatientRequestDTO = {
      id: 999,
      name: 'Non-existent Patient',
    };

    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(null);

    await expect(updatePatientUseCase.execute(updateData)).rejects.toMatchObject({
      statusCode: 404,
      code: 'PATIENT_NOT_FOUND_ERROR',
      message: 'No patient found with the given id: 999',
      service: 'UpdatePatientUseCase',
    });
  });
});
