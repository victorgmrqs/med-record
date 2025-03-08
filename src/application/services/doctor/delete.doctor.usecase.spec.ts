import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockDoctorRepository } from '@tests/mocks/doctor.mock';

import { DeleteDoctorUseCase } from './delete.doctor.usecase';

describe('DeleteDoctorUseCase', () => {
  let useCase: DeleteDoctorUseCase;

  beforeEach(() => {
    useCase = new DeleteDoctorUseCase(mockDoctorRepository);
    vi.clearAllMocks();
  });

  it('should delete a doctor when found', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(1);

    await useCase.execute(1);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(1);
    expect(mockDoctorRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when doctor not found', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toStrictEqual(
      new AppError(404, 'DOCTOR_NOT_FOUND_ERROR', 'No Doctor found with the given id: 1', 'DeleteDoctorUseCase'),
    );
  });
});
