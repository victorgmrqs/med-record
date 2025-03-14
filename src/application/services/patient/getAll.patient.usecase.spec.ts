import 'reflect-metadata';
import { Patient } from 'domain/entities/patient/patient';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { mockAllPatientsResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

import { GetAllPatientsUseCase } from './getAll.patient.usecase';

describe('GetAllPatientsUseCase', () => {
  let getAllPatientsUseCase: GetAllPatientsUseCase;

  beforeEach(() => {
    getAllPatientsUseCase = new GetAllPatientsUseCase(mockPatientRepository);
    vi.clearAllMocks();
  });

  it('should return all patients', async () => {
    vi.spyOn(mockPatientRepository, 'findAll').mockResolvedValue(mockAllPatientsResponse);
    const patients = await getAllPatientsUseCase.execute();
    const expectedResponse = Patient.toArrayResponse(mockAllPatientsResponse);
    expect(mockPatientRepository.findAll).toHaveBeenCalledTimes(1);
    expect(patients).toEqual(expectedResponse);
    expect(patients.length).toBe(2);
  });

  it('should return an empty array when no patients exist', async () => {
    vi.spyOn(mockPatientRepository, 'findAll').mockResolvedValue([]);

    const patients = await getAllPatientsUseCase.execute();

    expect(mockPatientRepository.findAll).toHaveBeenCalledTimes(1);
    expect(patients).toEqual([]);
    expect(patients.length).toBe(0);
  });

  it('should throw an error when repository fails', async () => {
    const mockError = new Error('Database error');

    vi.spyOn(mockPatientRepository, 'findAll').mockRejectedValue(mockError);

    await expect(getAllPatientsUseCase.execute()).rejects.toThrow(mockError);
    expect(mockPatientRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
