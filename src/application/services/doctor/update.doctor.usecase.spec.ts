import 'reflect-metadata';

import { DoctorResponseDTO } from 'application/dto/doctor.dto';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import { mockDoctorRepository } from '@tests/mocks/doctor.mock';

import { UpdateDoctorUseCase } from './update.doctor.usecase';

describe('UpdateDoctorUseCase', () => {
  let updateDoctorUseCase: UpdateDoctorUseCase;

  beforeEach(() => {
    updateDoctorUseCase = new UpdateDoctorUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should update doctor successfully', async () => {
    const existingDoctor: DoctorResponseDTO = {
      id: 1,
      name: 'Dr. João Silva',
      email: 'joao.silva@example.com',
    };

    const updatedDoctor: DoctorResponseDTO = {
      id: 1,
      name: 'Dr. João Silva Atualizado',
      email: 'joao.silva@example.com',
    };

    const updateData = {
      id: 1,
      name: 'Dr. João Silva Atualizado',
    };

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(existingDoctor);
    vi.spyOn(mockDoctorRepository, 'update').mockResolvedValue(updatedDoctor);

    const result = await updateDoctorUseCase.execute(updateData);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(1);
    expect(mockDoctorRepository.update).toHaveBeenCalledWith(updateData);
    expect(result).toEqual(updatedDoctor);
  });

  it('should return 404 when doctor does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    await expect(updateDoctorUseCase.execute({ id: 999, name: 'Não existe' })).rejects.toMatchObject({
      statusCode: 404,
      code: 'DOCTOR_NOT_FOUND_ERROR',
      message: 'No doctor found with the given id: 999',
      service: 'UpdateDoctorUseCase',
    });
  });
});
