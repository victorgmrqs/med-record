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
    updateAppointmentUseCase = new UpdateAppointmentUseCase(
      mockAppointmentRepository,
      mockDoctorRepository,
      mockPatientRepository,
    );
    vi.clearAllMocks();
  });

  it('should update the appointment successfully', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 1,
      doctorId: 2,
      patientId: 2,
      appointmentDate: new Date('2020-01-02T16:00:00.000Z').toISOString(),
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

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(mockFemalePatientDBResponse);

    vi.spyOn(mockAppointmentRepository, 'findByDoctorAndDate').mockResolvedValueOnce([]);

    const updatedAppointment = new Appointment(
      1,
      updateData.doctorId,
      updateData.patientId,
      new Date(updateData.appointmentDate),
      existingAppointment.createdAt,
      new Date(),
    );
    vi.spyOn(mockAppointmentRepository, 'update').mockResolvedValueOnce(updatedAppointment);

    const result = await updateAppointmentUseCase.execute(updateData);

    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(updateData.id);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(updateData.doctorId);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(updateData.patientId);
    expect(mockAppointmentRepository.findByDoctorAndDate).toHaveBeenCalledWith(
      updateData.doctorId,
      new Date(updateData.appointmentDate),
    );
    expect(mockAppointmentRepository.update).toHaveBeenCalledWith(updateData);
    expect(result).toEqual(updatedAppointment.toResponse());
  });

  it('should throw an error if the appointment does not exist', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 999,
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2020-01-02T16:00:00.000Z').toISOString(),
    };

    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(null);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(updateData.id);
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if updated doctor does not exist', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 1,
      doctorId: 99,
      patientId: 2,
      appointmentDate: new Date('2020-01-02T16:00:00.000Z').toISOString(),
    };

    const existingAppointment = new Appointment(
      1,
      1,
      2,
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
    );
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(existingAppointment);
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(null);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(updateData.doctorId);
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if updated patient does not exist', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 1,
      doctorId: 1,
      patientId: 99,
      appointmentDate: new Date('2020-01-02T16:00:00.000Z').toISOString(),
    };

    const existingAppointment = new Appointment(
      1,
      1,
      2,
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
      new Date('2020-01-01T16:00:00.000Z'),
    );
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(existingAppointment);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(null);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(updateData.patientId);
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if appointment time is outside business hours', async () => {
    const updateData: UpdateAppointmentRequestDTO = {
      id: 1,
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2020-01-01T06:00:00.000Z').toISOString(),
    };

    const existingAppointment = new Appointment(
      1,
      1,
      2,
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
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };

    const existingAppointment1 = new Appointment(1, 1, 2, new Date('2020-01-01T16:00:00.000Z'), new Date(), new Date());
    const existingAppointment2 = new Appointment(2, 1, 2, new Date('2020-01-01T17:00:00.000Z'), new Date(), new Date());
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValueOnce(existingAppointment2);
    vi.spyOn(mockAppointmentRepository, 'findByDoctorAndDate').mockResolvedValueOnce([existingAppointment1]);

    await expect(updateAppointmentUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findByDoctorAndDate).toHaveBeenCalledWith(
      updateData.doctorId,
      new Date(updateData.appointmentDate),
    );
    expect(mockAppointmentRepository.update).not.toHaveBeenCalled();
  });
});
