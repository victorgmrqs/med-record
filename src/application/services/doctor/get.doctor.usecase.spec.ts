import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { mockCreatedDoctor, mockDoctorRepository } from '@tests/mocks/doctor.mock';

import { GetDoctorUseCase } from './get.doctor.usecase';

describe('Get Doctor Use Case - Suite test -', () => {
  let getDoctorUseCase: GetDoctorUseCase;

  beforeEach(() => {
    getDoctorUseCase = new GetDoctorUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should get a doctor by id successfully', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);

    const doctor = await getDoctorUseCase.execute(1);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(1);
    expect(doctor).toEqual(mockCreatedDoctor.toResponse());
  });

  it('Should return null when doctor does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    await expect(getDoctorUseCase.execute(1)).rejects.toMatchObject({
      statusCode: 404,
      code: 'DOCTOR_NOT_FOUND_ERROR',
      message: 'Doctor not found',
      service: 'GetDoctorUseCase',
    });
  });
});
