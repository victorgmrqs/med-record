import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { Patient } from 'domain/entities/patient/patient';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockMalePatientRequest, mockMalePatientDBResponse } from '@tests/mocks/patient.mock';

describe('Get all patients Suite test - Integration', () => {
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

  it('should return all patients and return an empty array', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should return patients with data', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockMalePatientRequest,
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });
    const expectedResponse = Patient.mapPatientToResponse([mockMalePatientDBResponse]);

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(expectedResponse);
  });
});
