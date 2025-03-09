import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockFemalePatientDBResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

import { GetPatientUseCase } from './get.patient.usecase';
describe('GetPatientUseCase', () => {
  let getPatientUseCase: GetPatientUseCase;

  beforeEach(() => {
    getPatientUseCase = new GetPatientUseCase(mockPatientRepository);
    vi.clearAllMocks();
  });

  it('should return a patient when found', async () => {
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(mockFemalePatientDBResponse);
    const result = await getPatientUseCase.execute(2);

    expect(mockPatientRepository.findById).toHaveBeenCalledWith(2);
    expect(result).toEqual(mockFemalePatientDBResponse.toResponse());
  });

  it('should throw an AppError when patient is not found', async () => {
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(null);

    await expect(getPatientUseCase.execute(9999)).rejects.toBeInstanceOf(AppError);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(9999);
  });
});
