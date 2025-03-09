import 'reflect-metadata';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockCreatedDoctor, mockDoctorRepository, mockInputDoctorData } from '@tests/mocks/doctor.mock';

import { CreateDoctorUseCase } from './create.doctor.usecase';

describe('CreateDoctorUseCase', () => {
  let createDoctorUseCase: CreateDoctorUseCase;

  beforeEach(() => {
    createDoctorUseCase = new CreateDoctorUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should create a doctor successfully', async () => {
    vi.spyOn(mockDoctorRepository, 'findByEmail').mockResolvedValue(null);
    vi.spyOn(mockDoctorRepository, 'create').mockResolvedValue(mockCreatedDoctor);

    const result = await createDoctorUseCase.execute(mockInputDoctorData);

    expect(mockDoctorRepository.findByEmail).toHaveBeenCalledWith(mockInputDoctorData.email);
    expect(mockDoctorRepository.create).toHaveBeenCalledWith(mockInputDoctorData);
    expect(result).toEqual(mockCreatedDoctor.id);
  });

  it('should throw error when doctor email already exists', async () => {
    const doctorData = {
      name: 'Dr. João Silva',
      email: 'joao.silva@example.com',
    };
    vi.spyOn(mockDoctorRepository, 'findByEmail').mockResolvedValue(true);

    await expect(createDoctorUseCase.execute(doctorData)).rejects.toThrow(AppError);
    expect(mockDoctorRepository.findByEmail).toHaveBeenCalledWith(doctorData.email);
  });
});
