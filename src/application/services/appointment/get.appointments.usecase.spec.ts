import { Appointment } from 'domain/entities/appointment/appointments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockAppointmentRepository } from '@tests/mocks/appointment.mock';

import { GetAppointmentUseCase } from './get.appointments.usecase';

describe('GetAppointmentByIdUseCase', () => {
  let getAppointmentByIdUseCase: GetAppointmentUseCase;

  beforeEach(() => {
    getAppointmentByIdUseCase = new GetAppointmentUseCase(mockAppointmentRepository);
    vi.clearAllMocks();
  });

  it('should return a formatted appointment when found', async () => {
    const appointmentData = {
      id: 1,
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const appointmentInstance = new Appointment(
      appointmentData.id,
      appointmentData.doctorId,
      appointmentData.patientId,
      appointmentData.appointmentDate,
      appointmentData.createdAt,
      appointmentData.updatedAt,
    );
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(appointmentInstance);

    const result = await getAppointmentByIdUseCase.execute(appointmentData.id);

    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(appointmentData.id);
    expect(result).toEqual(appointmentInstance.toResponse());
  });

  it('should throw an AppError when appointment is not found', async () => {
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(null);

    await expect(getAppointmentByIdUseCase.execute(999)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(999);
  });
});
