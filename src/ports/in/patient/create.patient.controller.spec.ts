import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Create patient Suite test - Integration', () => {
  const fastify = Fastify();
  beforeAll(async () => {
    container.registerSingleton('PatientRepository', PrismaPatientRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);

    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should create a patient', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    expect(doctorResponse.statusCode).toBe(201);
    const doctorId = doctorResponse.json().id;

    const patientCreate = { ...mockMalePatientRequest, doctorId };
    const response = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ message: 'Patient created successfully' });
  });

  it('should not create a patient with invalid email', async () => {
    const patientCreate = { ...mockMalePatientRequest, email: 'invalid-email' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      service: 'CreatePatientController',
      fields: ['email'],
      issues: [
        {
          validation: 'email',
          code: 'invalid_string',
          message: 'Invalid email',
          path: ['email'],
        },
      ],
    });
  });

  it('should not create a patient with invalid birthDate', async () => {
    const patientCreate = { ...mockMalePatientRequest, birthDate: 'invalid-date' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ statusCode: 400 });
  });

  it('should return 400 for invalid birthDate format', async () => {
    const patientCreate = { ...mockMalePatientRequest, birthDate: '2020-13-01' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      service: 'CreatePatientController',
      fields: ['birthDate'],
      issues: [{ code: 'custom', message: 'birthDate must be in the format YYYY-MM-DD', path: ['birthDate'] }],
    });
  });
  it('should not create a patient with invalid Sex', async () => {
    const patientCreate = { ...mockMalePatientRequest, sex: 'A' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      service: 'CreatePatientController',
      fields: ['sex'],
      issues: [
        // eslint-disable-next-line quotes
        { code: 'invalid_enum_value', message: "Invalid enum value. Expected 'M' | 'F', received 'A'", path: ['sex'] },
      ],
    });
  });

  it('should return 400 when doctor is not found', async () => {
    const patientCreate = { ...mockMalePatientRequest, doctorId: 9999 };
    const response = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Doctor not found',
      service: 'CreatePatientController',
    });
  });
});
