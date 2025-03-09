import { Appointment } from 'domain/entities/appointment/appointments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { mockAllAppointmentsResponse, mockAppointmentRepository } from '@tests/mocks/appointment.mock';

import { GetAllAppointmentsUseCase } from './getAll.appointments.usecase';

describe('GetAllAppointmentsUseCase Unit Tests', () => {
  let getAllAppointmentsUseCase: GetAllAppointmentsUseCase;
  beforeEach(() => {
    getAllAppointmentsUseCase = new GetAllAppointmentsUseCase(mockAppointmentRepository);
    vi.clearAllMocks();
  });
  it('should return all appointments', async () => {
    vi.spyOn(mockAppointmentRepository, 'findAll').mockResolvedValue(mockAllAppointmentsResponse);

    const appointments = await getAllAppointmentsUseCase.execute();
    const expectedResponse = Appointment.mapAppointmentsToResponse(mockAllAppointmentsResponse);

    expect(mockAppointmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(appointments).toEqual(expectedResponse);
    expect(appointments.length).toBe(mockAllAppointmentsResponse.length);
  });

  it('should return an empty array when no appointments exist', async () => {
    vi.spyOn(mockAppointmentRepository, 'findAll').mockResolvedValue([]);

    const appointments = await getAllAppointmentsUseCase.execute();

    expect(mockAppointmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(appointments).toEqual([]);
    expect(appointments.length).toBe(0);
  });
});
