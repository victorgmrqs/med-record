import { UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { Appointment } from 'domain/entities/appointment/appointments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockAppointmentRepository } from '@tests/mocks/appointment.mock';
import { mockCreatedDoctor, mockDoctorRepository } from '@tests/mocks/doctor.mock';
import { mockFemalePatientDBResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

import { UpdateAppointmentUseCase } from './update.appointments.usecase';

describe('UpdateAppointmentUseCase', () => {
  let updateAppointmentUseCase: UpdateAppointmentUseCase;

  beforeEach(() => {
    updateAppointmentUseCase = new UpdateAppointmentUseCase(mockAppointmentRepository);
    vi.clearAllMocks();
  });

  it('should update the appointment successfully when only the date is changed', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 1,
      appointmentDate: new Date('2020-01-02T16:00:00.000Z'),
    };

    const existingAppointment = new Appointment(
      1,
      1,
      1,
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
    );
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(existingAppointment);
    vi.spyOn(mockAppointmentRepository, 'findByDoctorAndDate').mockResolvedValueOnce([]);

    const updatedAppointment = new Appointment(
      1,
      1,
      1,
      new Date(updateData.appointmentDate),
      existingAppointment.createdAt,
      new Date(),
    );
    vi.spyOn(mockAppointmentRepository, 'update').mockResolvedValueOnce(updatedAppointment);

    const result = await updateAppointmentUseCase.execute(updateData);

    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(updateData.id);
    expect(mockAppointmentRepository.findByDoctorAndDate).toHaveBeenCalledWith(1, new Date(updateData.appointmentDate));

    expect(result).toEqual(updatedAppointment.toResponse());
  });

  it('should throw an error if the appointment does not exist', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 999,
      appointmentDate: new Date('2020-01-02T16:00:00.000Z'),
    };

    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(null);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(updateData.id);
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if appointment time is outside business hours', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 1,
      appointmentDate: new Date('2020-01-01T06:00:00.000Z'),
    };

    const existingAppointment = new Appointment(
      1,
      1,
      1,
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
    );
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(existingAppointment);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if there is a scheduling conflict', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 2,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z'),
    };

    const existingAppointment = new Appointment(
      2,
      1,
      1,
      new Date('2020-01-01T17:00:00.000Z'),
      new Date('2020-01-01T17:00:00.000Z'),
      new Date('2020-01-01T17:00:00.000Z'),
    );
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(existingAppointment);

    // Simula que já existe um outro agendamento para o mesmo médico no novo horário
    const conflictingAppointment = new Appointment(
      1,
      1,
      1,
      new Date('2020-01-01T16:00:00.000Z'),
      new Date(),
      new Date(),
    );
    vi.spyOn(mockAppointmentRepository, 'findByDoctorAndDate').mockResolvedValueOnce([conflictingAppointment]);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findByDoctorAndDate).toHaveBeenCalledWith(1, new Date(updateData.appointmentDate));
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });
});
