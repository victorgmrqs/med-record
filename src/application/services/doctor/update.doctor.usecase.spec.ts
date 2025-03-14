import 'reflect-metadata';

import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import {
  mockCreatedDoctor,
  mockDoctorRepository,
  mockInputDoctorDataToUpdate,
  mockUpdatedDoctor,
} from '@tests/mocks/doctor.mock';

import { UpdateDoctorUseCase } from './update.doctor.usecase';

describe('UpdateDoctorUseCase', () => {
  let updateDoctorUseCase: UpdateDoctorUseCase;

  beforeEach(() => {
    updateDoctorUseCase = new UpdateDoctorUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should update doctor successfully', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockDoctorRepository, 'update').mockResolvedValue(mockUpdatedDoctor);

    const result = await updateDoctorUseCase.execute(mockInputDoctorDataToUpdate);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(1);
    expect(mockDoctorRepository.update).toHaveBeenCalledWith(mockInputDoctorDataToUpdate);
    expect(result).toEqual(mockUpdatedDoctor.toResponse());
  });

  it('should return 404 when doctor does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    await expect(updateDoctorUseCase.execute({ id: 999, name: 'Não existe' })).rejects.toMatchObject({
      statusCode: 404,
      code: 'DOCTOR_NOT_FOUND_ERROR',
      message: 'Doctor not found',
      service: 'UpdateDoctorUseCase',
    });
  });
});
