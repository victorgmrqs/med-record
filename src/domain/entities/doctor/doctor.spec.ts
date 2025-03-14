import { describe, it, expect } from 'vitest';

import AppError from '@shared/errors/AppError';

import { Doctor } from './doctor';

describe('Doctor Entity', () => {
  it('should create a doctor with valid data', () => {
    const doctor = new Doctor(1, 'John Doe', 'john.doe@example.com', new Date(), new Date());
    expect(doctor).toBeInstanceOf(Doctor);
    expect(doctor.id).toBe(1);
    expect(doctor.name).toBe('John Doe');
    expect(doctor.email).toBe('john.doe@example.com');
  });

  it('should throw an error for invalid email', () => {
    expect(() => {
      new Doctor(1, 'John Doe', 'invalid-email', new Date(), new Date());
    }).toThrow(AppError);
  });

  it('should throw an error with correct message for invalid email', () => {
    try {
      new Doctor(1, 'John Doe', 'invalid-email', new Date(), new Date());
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      if (error instanceof AppError) {
        expect(error.message).toBe('Invalid email format');
        expect(error.statusCode).toBe(400);
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.service).toBe('Doctor');
      }
    }
  });
});
