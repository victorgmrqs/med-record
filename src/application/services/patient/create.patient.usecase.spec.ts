import 'reflect-metadata';

import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import {
  mockPatientRepository,
  mockFemalePatientDBResponse,
  mockFemalePatientRequest,
} from '@tests/mocks/patient.mock';

import { CreatePatientUseCase } from './create.patient.usecase';

describe('CreatePatientUseCase', () => {
  let createPatientUseCase: CreatePatientUseCase;

  beforeEach(() => {
    createPatientUseCase = new CreatePatientUseCase(mockPatientRepository);
    vi.clearAllMocks();
  });

  it('deve criar um paciente novo', async () => {
    vi.spyOn(mockPatientRepository, 'findByEmail').mockResolvedValueOnce(null);
    vi.spyOn(mockPatientRepository, 'create').mockResolvedValueOnce(mockFemalePatientDBResponse);

    const result = await createPatientUseCase.execute(mockFemalePatientRequest);

    expect(mockPatientRepository.findByEmail).toHaveBeenCalledWith(mockFemalePatientRequest.email);
    expect(mockPatientRepository.create).toHaveBeenCalled();
    expect(result).toBe(mockFemalePatientDBResponse.id);
  });

  it('deve lançar um AppError se o paciente já existir', async () => {
    vi.spyOn(mockPatientRepository, 'findByEmail').mockResolvedValueOnce(true);

    await expect(createPatientUseCase.execute(mockFemalePatientRequest)).rejects.toBeInstanceOf(AppError);

    expect(mockPatientRepository.findByEmail).toHaveBeenCalledWith(mockFemalePatientRequest.email);
    expect(mockPatientRepository.create).not.toHaveBeenCalled();
  });
});
