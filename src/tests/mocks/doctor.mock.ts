import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { Doctor } from 'domain/entities/doctor/doctor';
import { vi } from 'vitest';

export const mockDoctorRepository: IDoctorRepository = {
  create: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
};

export const mockInputDoctorData = {
  name: 'João Silva',
  email: 'joao.silva@example.com',
  password: 'secretpassword',
};

export const mockInputDoctorData2 = {
  name: 'Maria Santos',
  email: 'a@a.com',
  password: 'secretpassword',
};

export const mockInputDoctorDataWithoutPassword = {
  name: 'João Silva',
  email: 'a@a.com',
};

export const mockDoctorResponseOjb = {
  name: 'João Silva',
  email: 'joao.silva@example.com',
};

const mockStringDate = new Date('2021-09-01T00:00:00.000Z').toISOString();
const mockDate = new Date(mockStringDate);

export const mockExistingDoctor = new Doctor(1, 'João Silva', 'joao.silva@example.com', mockStringDate, mockDate);

export const mockCreatedDoctor = new Doctor(1, 'João Silva', 'joao.silva@example.com', mockStringDate, mockDate);

export const mockgetAllDoctorResponse = [mockCreatedDoctor.toResponse()];

export const mockInputDoctorDataToUpdate = {
  id: 1,
  name: 'João Silva Atualizado',
};
export const mockUpdatedDoctor = new Doctor(
  1,
  'João Silva Atualizado',
  'joao.silva@example.com',
  mockStringDate,
  mockDate,
);

export const mockDoctorDBResponseWithPassword = new Doctor(
  1,
  'João Silva',
  'joao.silva@example.com',
  'secretpassword',
  mockDate,
  mockDate,
);

export const mockCreatedDoctor2 = new Doctor(2, 'Maria Santos', 'email@a.com', mockStringDate, mockDate);

export const mockDoctors: Doctor[] = [mockCreatedDoctor, mockCreatedDoctor2];
