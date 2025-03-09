import { PatientRequestDTO, PatientResponseDTO } from 'application/dto/patient.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { Patient } from 'domain/entities/patient/patient';
import { vi } from 'vitest';

export const mockPatientRepository: IPatientRepository = {
  create: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  update: vi.fn(),
};

// ==== MALE PATIENT ====

// ====== MALE PATIENT ======

// 1. Input inicial para criação
export const mockMalePatientRequest = {
  name: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '123456789',
  birthDate: new Date('2000-01-01'),
  sex: 'M',
  height: 1.8,
  weight: 75,
};

// 2. Estado no banco antes da atualização
export const mockMalePatientDBResponse = new Patient(
  1,
  'John Doe',
  'john@example.com',
  '123456789',
  new Date('2000-01-01').toISOString(),
  'M',
  1.8,
  75,
  new Date('2021-01-01'),
  new Date('2021-01-01'),
);

// 3. Corpo para atualização
export const mockMalePatientInputDataToUpdate = {
  name: 'John Doe da Silva',
  weight: 70,
};

// 4. Estado no banco após atualização
export const mockUpdatedMalePatient = new Patient(
  1,
  'John Doe da Silva',
  'john@example.com',
  '123456789',
  new Date('2000-01-01').toISOString(),
  'M',
  1.8,
  70,
  new Date('2021-01-01'),
  new Date(), // Atualizado na última modificação
);

// ====== END ======

// ====== FEMALE PATIENT ======

// 1. Input inicial para criação
export const mockFemalePatientRequest: PatientRequestDTO = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phoneNumber: '456',
  birthDate: new Date('1990-04-15').toISOString(),
  sex: 'F',
  height: 1.6,
  weight: 60,
};

// 2. Estado no banco antes da atualização
export const mockFemalePatientDBResponse = new Patient(
  2,
  'Jane Doe',
  'jane@example.com',
  '456',
  new Date('1990-04-15').toISOString(),
  'F',
  1.6,
  60,
  new Date('2021-01-01'),
  new Date('2021-01-01'),
);

// 3. Corpo para atualização
export const mockFemalePatientInputDataToUpdate = {
  id: 2,
  phoneNumber: '789',
  height: 1.65,
};

// 4. Estado no banco após atualização
export const mockUpdatedFemalePatient = new Patient(
  2,
  'Jane Doe',
  'jane@example.com',
  '789', // Atualizado
  new Date('1990-04-15').toISOString(),
  'F',
  1.65, // Atualizado
  60,
  new Date('2021-01-01'),
  new Date(), // Atualizado na última modificação
);

// ====== END ======

// ====== LISTAGEM DE TODOS OS PACIENTES ======

export const mockAllPatientsResponse: Patient[] = [mockMalePatientDBResponse, mockFemalePatientDBResponse];

export const mockAllUpdatedPatientsResponse: Patient[] = [mockUpdatedMalePatient, mockUpdatedFemalePatient];
