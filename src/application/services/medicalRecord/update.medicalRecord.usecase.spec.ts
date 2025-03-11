import { UpdateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { Appointment } from 'domain/entities/appointment/appointments';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockAppointmentDBResponse, mockAppointmentRepository } from '@tests/mocks/appointment.mock';
import { mockCreatedDoctor, mockDoctorRepository } from '@tests/mocks/doctor.mock';
import {
  mockMedicalRecordDBResponse,
  mockMedicalRecordRepository,
  mockMedicalRecordUpdateDBResponse,
  mockMedicalRecordUpdateInputRequest,
} from '@tests/mocks/medicalRecord.mock';
import { mockMalePatientDBResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

import { UpdateMedicalRecordUseCase } from './update.medicalRecord.usecase';

describe('UpdateMedicalRecordUseCase', () => {
  let updateMedicalRecordUseCase: UpdateMedicalRecordUseCase;

  beforeEach(() => {
    updateMedicalRecordUseCase = new UpdateMedicalRecordUseCase(
      mockMedicalRecordRepository,
      mockDoctorRepository,
      mockPatientRepository,
      mockAppointmentRepository,
    );
    vi.clearAllMocks();
  });

  it('should update the medical record successfully', async () => {
    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(mockMedicalRecordDBResponse);

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockMalePatientDBResponse);
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(mockAppointmentDBResponse);

    vi.spyOn(mockMedicalRecordRepository, 'update').mockResolvedValue(mockMedicalRecordUpdateDBResponse);

    const result = await updateMedicalRecordUseCase.execute(mockMedicalRecordUpdateInputRequest);
    expect(mockMedicalRecordRepository.findById).toHaveBeenCalledWith(mockMedicalRecordUpdateInputRequest.id);
    expect(result).toEqual(mockMedicalRecordUpdateDBResponse.toResponse());
  });

  it('should throw an error if the medical record does not exist', async () => {
    const updateData = { ...mockMedicalRecordUpdateInputRequest, id: 99 };

    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(null);

    await expect(updateMedicalRecordUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockMedicalRecordRepository.findById).toHaveBeenCalledWith(updateData.id);
    expect(mockMedicalRecordRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the updated doctor does not exist', async () => {
    const updateData = { ...mockMedicalRecordUpdateInputRequest, doctorId: 99 };

    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(mockMedicalRecordDBResponse);
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    await expect(updateMedicalRecordUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(updateData.doctorId);
    expect(mockMedicalRecordRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the updated patient does not exist', async () => {
    const updateData = { ...mockMedicalRecordUpdateInputRequest, patientId: 99 };
    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(mockMedicalRecordDBResponse);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(null);

    await expect(updateMedicalRecordUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(updateData.patientId);
    expect(mockMedicalRecordRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the updated appointment does not exist', async () => {
    const updateData = {
      ...mockMedicalRecordUpdateInputRequest,
      appointmentId: 99,
    };

    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(mockMedicalRecordDBResponse);
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(null);

    await expect(updateMedicalRecordUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(updateData.appointmentId);
    expect(mockMedicalRecordRepository.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the updated appointment does not match the provided doctor and patient', async () => {
    const updateData: UpdateMedicalRecordRequestDTO = {
      id: 1,
      doctorId: 1,
      patientId: 1,
      appointmentId: 99,
      notes: 'Updated observation test',
    };

    const existingRecord = new MedicalRecord(
      1,
      1,
      2,
      3,
      'Initial diagnosis',
      new Date('2020-01-01T16:00:00.000Z').toISOString(),
      new Date('2020-01-01T16:00:00.000Z').toISOString(),
    );

    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockMalePatientDBResponse);

    const invalidAppointmentId = 99;
    const mockMismatchedAppointment = new Appointment(
      invalidAppointmentId,
      9,
      2,
      new Date('2020-01-01T16:00:00.000Z'),
      new Date(),
      new Date(),
    );
    vi.spyOn(mockMedicalRecordRepository, 'findById').mockResolvedValue(existingRecord);
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(mockMismatchedAppointment);

    await expect(updateMedicalRecordUseCase.execute(updateData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(updateData.appointmentId);
    expect(mockMedicalRecordRepository.update).not.toHaveBeenCalled();
  });
});
