import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mockMalePatientDBResponse, mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Get Patient by ID Suite test - Integration', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton<IPatientRepository>('PatientRepository', PrismaPatientRepository);
    fastify.register(prismaPlugin);
    fastify.register(patientsRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return a patient by ID', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockMalePatientRequest,
    });

    const response = await fastify.inject({ method: 'GET', url: '/1' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockMalePatientDBResponse.toResponse());
  });

  it('should return 404 when the patient is not found', async () => {
    const response = await fastify.inject({ method: 'GET', url: '/1' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: 'PATIENT_NOT_FOUND_ERROR',
      message: 'No patient found with the given id: 1',
      service: 'GetPatientController',
    });
  });
});
