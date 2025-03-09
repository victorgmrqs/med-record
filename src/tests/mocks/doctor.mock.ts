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
};

export const mockExistingDoctor = new Doctor(
  1,
  'João Silva',
  'joao.silva@example.com',
  new Date('2021-09-01T00:00:00.000Z'),
  new Date('2021-09-01T00:00:00.000Z'),
);

export const mockCreatedDoctor = new Doctor(
  1,
  'João Silva',
  'joao.silva@example.com',
  new Date('2021-09-01T00:00:00.000Z'),
  new Date('2021-09-01T00:00:00.000Z'),
);

export const mockInputDoctorDataToUpdate = {
  id: 1,
  name: 'João Silva Atualizado',
};
export const mockUpdatedDoctor = new Doctor(
  1,
  'João Silva Atualizado',
  'joao.silva@example.com',
  new Date('2021-09-01T00:00:00.000Z'),
  new Date('2021-09-01T00:00:00.000Z'),
);

export const mockCreatedDoctor2 = new Doctor(
  2,
  'Maria Santos',
  'email@a.com',
  new Date('2021-09-01T00:00:00.000Z'),
  new Date('2021-09-01T00:00:00.000Z'),
);

export const mockDoctors: Doctor[] = [mockCreatedDoctor, mockCreatedDoctor2];
