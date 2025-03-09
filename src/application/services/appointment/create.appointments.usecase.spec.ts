import 'reflect-metadata';
import { CreateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { Appointment } from 'domain/entities/appointment/appointments';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockAppointmentRepository } from '@tests/mocks/appointment.mock';
import { mockCreatedDoctor, mockDoctorRepository } from '@tests/mocks/doctor.mock';
import { mockFemalePatientDBResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

import { CreateAppointmentsUseCase } from './create.appointments.usecase';

describe('CreateAppointmentsUseCase', () => {
  beforeEach(() => {
    createAppointmentsUseCase = new CreateAppointmentsUseCase(
      mockAppointmentRepository,
      mockDoctorRepository,
      mockPatientRepository,
    );

    vi.clearAllMocks();
  });

  let createAppointmentsUseCase: CreateAppointmentsUseCase;

  it('should create an appointment successfully when no conflict exists', async () => {
    const mockAppointmentInputRequest: CreateAppointmentRequestDTO = {
      doctorId: 1,
      patientId: 2,
      appointmentDate: '2020-01-01T16:00:00.000Z',
    };

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(mockFemalePatientDBResponse);
    vi.spyOn(mockAppointmentRepository, 'isDoctorAvailable').mockResolvedValueOnce(true);

    const createdAppointment = new Appointment(
      123,
      mockAppointmentInputRequest.doctorId,
      mockAppointmentInputRequest.patientId,
      new Date(mockAppointmentInputRequest.appointmentDate),
      new Date(),
      new Date(),
    );
    vi.spyOn(mockAppointmentRepository, 'create').mockResolvedValueOnce(createdAppointment);

    const result = await createAppointmentsUseCase.execute(mockAppointmentInputRequest);

    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(mockAppointmentInputRequest.doctorId);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(mockAppointmentInputRequest.patientId);

    const appointmentDate = new Date(mockAppointmentInputRequest.appointmentDate);
    expect(mockAppointmentRepository.isDoctorAvailable).toHaveBeenCalledWith(
      mockAppointmentInputRequest.doctorId,
      appointmentDate,
      new Date(appointmentDate.getTime() + 60 * 60 * 1000),
    );

    expect(mockAppointmentRepository.create).toHaveBeenCalledWith(mockAppointmentInputRequest);
    expect(result).toBe(createdAppointment.id);
  });

  it('should throw an error if the doctor does not exist', async () => {
    const inexistentDoctorId = 99;
    const appointmentData: CreateAppointmentRequestDTO = {
      doctorId: inexistentDoctorId,
      patientId: 2,
      appointmentDate: new Date('2025-03-10T10:00:00Z').toISOString(),
    };

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(null);

    await expect(createAppointmentsUseCase.execute(appointmentData)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(appointmentData.doctorId);
    expect(mockPatientRepository.findById).not.toHaveBeenCalled();
    expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
  });
  it('should throw an error if the patient does not exist', async () => {
    const inexistentPatientId = 99;
    const appointmentData: CreateAppointmentRequestDTO = {
      doctorId: 1,
      patientId: inexistentPatientId,
      appointmentDate: new Date('2025-03-10T10:00:00Z').toISOString(),
    };

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(null);

    await expect(createAppointmentsUseCase.execute(appointmentData)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(appointmentData.doctorId);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(appointmentData.patientId);
    expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if appointment time is outside business hours', async () => {
    const appointmentData: CreateAppointmentRequestDTO = {
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2025-03-10T06:00:00Z').toISOString(),
    };

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(mockFemalePatientDBResponse);

    await expect(createAppointmentsUseCase.execute(appointmentData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if there is a scheduling conflict', async () => {
    const appointmentData: CreateAppointmentRequestDTO = {
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2025-03-10T10:00:00Z').toISOString(),
    };
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValueOnce(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValueOnce(mockFemalePatientDBResponse);

    vi.spyOn(mockAppointmentRepository, 'isDoctorAvailable').mockResolvedValue(false);

    await expect(createAppointmentsUseCase.execute(appointmentData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.isDoctorAvailable).toHaveBeenCalled();
    expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
  });
});
