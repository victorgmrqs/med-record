import { CreateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { CreateMedicalRecordUseCase } from 'application/services/medicalRecord/create.medicalRecord.usecase';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockAppointmentDBResponse, mockAppointmentRepository } from '@tests/mocks/appointment.mock';
import { mockCreatedDoctor, mockDoctorRepository } from '@tests/mocks/doctor.mock';
import {
  mockMedicalRecordDBResponse,
  mockMedicalRecordInputRequest,
  mockMedicalRecordRepository,
} from '@tests/mocks/medicalRecord.mock';
import { mockMalePatientDBResponse, mockPatientRepository } from '@tests/mocks/patient.mock';

describe('CreateMedicalRecordUseCase', () => {
  let createMedicalRecordUseCase: CreateMedicalRecordUseCase;

  beforeEach(() => {
    createMedicalRecordUseCase = new CreateMedicalRecordUseCase(
      mockMedicalRecordRepository,
      mockDoctorRepository,
      mockPatientRepository,
      mockAppointmentRepository,
    );
    vi.clearAllMocks();
  });

  it('should create a medical record successfully when all entities exist and appointment is valid', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockMalePatientDBResponse);

    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(mockAppointmentDBResponse);

    vi.spyOn(mockMedicalRecordRepository, 'create').mockResolvedValue(mockMedicalRecordDBResponse);

    const result = await createMedicalRecordUseCase.execute(mockMedicalRecordInputRequest);
    expect(result).toBe(mockMedicalRecordDBResponse.id);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.doctorId);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.patientId);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.appointmentId);
    expect(mockMedicalRecordRepository.create).toHaveBeenCalledWith(mockMedicalRecordInputRequest);
  });

  it('should throw an error if the doctor does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(null);

    await expect(createMedicalRecordUseCase.execute(mockMedicalRecordInputRequest)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.doctorId);
    expect(mockPatientRepository.findById).not.toHaveBeenCalled();
    expect(mockAppointmentRepository.findById).not.toHaveBeenCalled();
    expect(mockMedicalRecordRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the patient does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(null);

    await expect(createMedicalRecordUseCase.execute(mockMedicalRecordInputRequest)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.doctorId);
    expect(mockPatientRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.patientId);
    expect(mockAppointmentRepository.findById).not.toHaveBeenCalled();
    expect(mockMedicalRecordRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the appointment does not exist', async () => {
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockMalePatientDBResponse);
    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(null);

    await expect(createMedicalRecordUseCase.execute(mockMedicalRecordInputRequest)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(mockMedicalRecordInputRequest.appointmentId);
    expect(mockMedicalRecordRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if the appointment does not match the provided doctor and patient', async () => {
    const inputData = { ...mockMedicalRecordInputRequest, appointmentId: 3, patientId: 2 };
    vi.spyOn(mockDoctorRepository, 'findById').mockResolvedValue(mockCreatedDoctor);
    vi.spyOn(mockPatientRepository, 'findById').mockResolvedValue(mockMalePatientDBResponse);

    vi.spyOn(mockAppointmentRepository, 'findById').mockResolvedValue(mockAppointmentDBResponse);

    await expect(createMedicalRecordUseCase.execute(inputData)).rejects.toBeInstanceOf(AppError);
    expect(mockAppointmentRepository.findById).toHaveBeenCalledWith(inputData.appointmentId);
    expect(mockMedicalRecordRepository.create).not.toHaveBeenCalled();
  });
});
