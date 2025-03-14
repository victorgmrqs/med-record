import { describe, expect, it } from 'vitest';

import AppError from '@shared/errors/AppError';

import { Patient } from './patient';

describe('Patient Entity', () => {
  it('should create an instance with valid email', () => {
    const patient = new Patient(1, 'Nome', 'email@domain.com', '123456789', '2000-01-01', 'M', 170, 70, 100);
    expect(patient).toBeDefined();
    expect(patient.email).toBe('email@domain.com');
  });

  it('should throw an error when creating the instance with an invalid email', () => {
    expect(() => {
      new Patient(1, 'Nome', 'invalid-email', '123456789', '2000-01-01', 'M', 170, 70, 100);
    }).toThrow(AppError);
  });

  it('should update data with updateWith', () => {
    const patient = new Patient(1, 'Nome', 'valid@domain.com', '123456789', '2000-01-01', 'M', 170, 70, 100);
    patient.updateWith({ name: 'Novo Nome', weight: 75 });
    expect(patient.name).toBe('Novo Nome');
    expect(patient.weight).toBe(75);
  });

  it('should create an instance from Prisma data', () => {
    const prismaData = {
      id: 1,
      name: 'Nome',
      email: 'valid@domain.com',
      phone_number: '123456789',
      birth_date: new Date('2000-01-01'),
      sex: 'M' as const,
      height: '170',
      weight: '70',
      doctor_id: 100,
    };
    const patient = Patient.fromDBRepository(prismaData);
    expect(patient.birthDate).toBe('2000-01-01');
  });

  it('should generate a response with toResponse', () => {
    const patient = new Patient(1, 'Nome', 'valid@domain.com', '123456789', '2000-01-01', 'M', 170, 70, 100);
    const response = patient.toResponse();
    expect(response.id).toBe(1);
    expect(response.email).toBe('valid@domain.com');
  });
});
