import 'reflect-metadata';

import { Doctor } from 'domain/entities/doctor/doctor';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { mockDoctorRepository, mockDoctors } from '@tests/mocks/doctor.mock';

import { GetAllDoctorsUseCase } from './getAll.doctor.usecase';

describe('GetAllDoctorsUseCase', () => {
  let getAllDoctorsUseCase: GetAllDoctorsUseCase;

  beforeEach(() => {
    getAllDoctorsUseCase = new GetAllDoctorsUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should return all doctors', async () => {
    vi.spyOn(mockDoctorRepository, 'findAll').mockResolvedValue(mockDoctors);

    const doctors = await getAllDoctorsUseCase.execute();

    const expectedFormatedDoctors = Doctor.toArrayResponse(mockDoctors);
    expect(mockDoctorRepository.findAll).toHaveBeenCalledTimes(1);
    expect(doctors).toEqual(expectedFormatedDoctors);
    expect(doctors.length).toBe(mockDoctors.length);
  });

  it('should return an empty array when no doctors exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findAll').mockResolvedValue([]);

    const doctors = await getAllDoctorsUseCase.execute();

    expect(mockDoctorRepository.findAll).toHaveBeenCalledTimes(1);
    expect(doctors).toEqual([]);
    expect(doctors.length).toBe(0);
  });

  it('should throw an error when repository fails', async () => {
    const mockError = new Error('Database connection failed');

    vi.spyOn(mockDoctorRepository, 'findAll').mockRejectedValue(mockError);

    await expect(getAllDoctorsUseCase.execute()).rejects.toThrow(mockError);
    expect(mockDoctorRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
