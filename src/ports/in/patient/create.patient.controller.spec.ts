import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';

import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Create patient Suite test - Integration', () => {
  const fastify = Fastify();
  beforeAll(async () => {
    container.registerSingleton('PatientRepository', PrismaPatientRepository);

    fastify.register(prismaPlugin);
    fastify.register(patientsRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should create a patient', async () => {
    const patientCreate = mockMalePatientRequest;
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ message: 'Patient created successfully' });
  });
  it('should not create a patient with invalid email', async () => {
    const patientCreate = { ...mockMalePatientRequest, email: 'invalid-email' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ statusCode: 400 });
  });

  it('should not create a patient with invalid birthDate', async () => {
    const patientCreate = { ...mockMalePatientRequest, birthDate: 'invalid-date' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: patientCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ statusCode: 400 });
  });
  it('should return 400 for invalid birthDate format', async () => {
    const patientCreate = { ...mockMalePatientRequest, birthDate: '2020-13-01' };
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
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
      url: '/',
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
});
