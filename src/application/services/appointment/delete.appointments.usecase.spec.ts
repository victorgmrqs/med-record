import { Appointment } from 'domain/entities/appointment/appointments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockAppointmentRepository } from '@tests/mocks/appointment.mock';

import { DeleteAppointmentUseCase } from './delete.appointments.usecase';

describe('DeleteAppointmentUseCase', () => {
  let deleteAppointmentUseCase: DeleteAppointmentUseCase;

  beforeEach(() => {
    deleteAppointmentUseCase = new DeleteAppointmentUseCase(mockAppointmentRepository);
    vi.clearAllMocks();
  });

  it('should delete the appointment successfully when it exists', async () => {
    const appointmentInstance = new Appointment(1, 1, 2, new Date('2020-01-01T16:00:00.000Z'), new Date(), new Date());
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(appointmentInstance);
    vi.spyOn(mockAppointmentRepository, 'delete').mockResolvedValue();

    await expect(deleteAppointmentUseCase.execute(1)).resolves.toBeUndefined();
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(1);
    expect(mockAppointmentRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw an error if the appointment does not exist', async () => {
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(null);

    await expect(deleteAppointmentUseCase.execute(999)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(999);
    expect(mockAppointmentRepository.delete).not.toHaveBeenCalled();
  });
});
