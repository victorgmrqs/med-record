import { CreateMedicalRecordRequestDTO, UpdateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { IMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.respository.interface';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';
import { vi } from 'vitest';

export const mockMedicalRecordRepository: IMedicalRecordRepository = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
};

export const mockMedicalRecordInputRequest: CreateMedicalRecordRequestDTO = {
  doctorId: 1,
  patientId: 1,
  appointmentId: 1,
  diagnosis: 'Some diagnosis',
  prescription: 'Some prescription',
  notes: 'Some Observation',
};

export const mockMedicalRecordDBResponse = new MedicalRecord(
  1,
  1,
  1,
  1,
  'Some diagnosis',
  'Some prescription',
  'Some Observation',
  new Date('2025-03-09T10:00:00.000Z'),
  new Date('2025-03-09T10:00:00.000Z'),
);

export const mockMedicalRecordUpdateInputRequest: UpdateMedicalRecordRequestDTO = {
  id: 1,
  doctorId: 1,
  patientId: 1,
  appointmentId: 1,
  diagnosis: 'Updated diagnosis',
  prescription: 'Updated prescription',
  notes: 'Updated observation test',
};

export const mockMedicalRecordUpdateDBResponse = new MedicalRecord(
  1,
  1,
  1,
  1,
  'Updated diagnosis',
  'Updated prescription',
  'Updated observation test',
  new Date('2025-03-09T10:00:00.000Z'),
  new Date('2025-03-09T10:00:00.000Z'),
);

export const mockAllMedicalRecordsResponse = MedicalRecord.mapRecordsToResponse([mockMedicalRecordDBResponse]);
