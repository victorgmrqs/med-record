import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockMalePatientDBResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

import { DeletePatientUseCase } from './delete.patient.usecase';

describe('DeletePatientUseCase', () => {
  let deletePatientUseCase: DeletePatientUseCase;

  beforeEach(() => {
    deletePatientUseCase = new DeletePatientUseCase(mockPatientRepository);
    vi.clearAllMocks();
  });

  it('deve deletar o paciente com sucesso', async () => {
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockMalePatientDBResponse);
    vi.spyOn(mockPatientRepository, 'delete').mockResolvedValue();

    await deletePatientUseCase.execute(1);

    expect(mockPatientRepository.findById).toHaveBeenCalledWith(1);
    expect(mockPatientRepository.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro 404 se o paciente não for encontrado', async () => {
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(null);

    await expect(deletePatientUseCase.execute(999)).rejects.toStrictEqual(
      new AppError(404, 'PATIENT_NOT_FOUND_ERROR', 'No patient found with the given id: 999', 'DeletePatientUseCase'),
    );
  });
});
