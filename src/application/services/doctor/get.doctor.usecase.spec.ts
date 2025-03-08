import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { mockDoctorRepository } from '@tests/mocks/doctor.mock';

import { GetDoctorUseCase } from './get.doctor.usecase';

describe('Get Doctor Use Case - Suite test -', () => {
  let getDoctorUseCase: GetDoctorUseCase;

  beforeEach(() => {
    getDoctorUseCase = new GetDoctorUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should get a doctor by id successfully', async () => {
    // Mock data
    const mockDoctor = {
      id: 1,
      name: 'Dr. João Silva',
      email: 'email@email.com',
    };

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockDoctor);

    const doctor = await getDoctorUseCase.execute(1);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(1);
    expect(doctor).toEqual(mockDoctor);
  });

  it('Should return null when doctor does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    const doctor = await getDoctorUseCase.execute(1);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(1);
    expect(doctor).toBeNull();
  });
});
