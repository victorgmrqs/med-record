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
  name: 'Dr. João Silva',
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
  'Dr. João Silva',
  'joao.silva@example.com',
  new Date('2021-09-01T00:00:00.000Z'),
  new Date('2021-09-01T00:00:00.000Z'),
);
