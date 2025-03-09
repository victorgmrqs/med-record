import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PrismaClient } from '@prisma/client';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Delete Patient | Integration test suite', () => {
  const fastify = Fastify();
  const prisma = new PrismaClient();

  beforeAll(async () => {
    container.registerSingleton<IPatientRepository>('PatientRepository', PrismaPatientRepository);
    fastify.register(prismaPlugin);
    fastify.register(patientsRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('Delete an Existant patient', async () => {
    const created = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockMalePatientRequest,
    });

    expect(created.statusCode).toBe(201);
    const createdPatientID = created.json().id;

    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: `/${createdPatientID}`,
    });

    expect(deleteResponse.statusCode).toBe(204);
  });
  it('Delete a non-existent patient returns 404', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/999',
    });
    expect(response.statusCode).toBe(404);
  });

  it('Delete with malformed ID returns 400', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/invalid-id-format',
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      message: 'Validation error',
    });
  });
});
