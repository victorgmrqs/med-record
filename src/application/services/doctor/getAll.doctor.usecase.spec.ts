import 'reflect-metadata';

import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { mockDoctorRepository } from '@tests/mocks/doctor.mock';

import { GetAllDoctorsUseCase } from './getAll.doctor.usecase';

describe('GetAllDoctorsUseCase', () => {
  let getAllDoctorsUseCase: GetAllDoctorsUseCase;

  beforeEach(() => {
    getAllDoctorsUseCase = new GetAllDoctorsUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should return all doctors', async () => {
    // Mock data
    const mockDoctors: DoctorResponseDTO[] = [
      {
        id: 1,
        name: 'Dr. João Silva',
        email: 'joao.silva@example.com',
      },
      {
        id: 2,
        name: 'Dra. Maria Santos',
        email: 'maria.santos@example.com',
      },
    ];

    vi.spyOn(mockDoctorRepository, 'findAll').mockResolvedValue(mockDoctors);

    // Execute use case
    const doctors = await getAllDoctorsUseCase.execute();

    // Assertions
    expect(mockDoctorRepository.findAll).toHaveBeenCalledTimes(1);
    expect(doctors).toEqual(mockDoctors);
    expect(doctors.length).toBe(2);
  });

  it('should return an empty array when no doctors exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findAll').mockResolvedValue([]);

    // Execute use case
    const doctors = await getAllDoctorsUseCase.execute();

    // Assertions
    expect(mockDoctorRepository.findAll).toHaveBeenCalledTimes(1);
    expect(doctors).toEqual([]);
    expect(doctors.length).toBe(0);
  });

  it('should throw an error when repository fails', async () => {
    const mockError = new Error('Database connection failed');

    vi.spyOn(mockDoctorRepository, 'findAll').mockRejectedValue(mockError);

    // Execute and assert
    await expect(getAllDoctorsUseCase.execute()).rejects.toThrow(mockError);
    expect(mockDoctorRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
