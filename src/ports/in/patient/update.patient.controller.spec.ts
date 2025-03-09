import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { PrismaClient } from '@prisma/client';
import {
  mockMalePatientInputDataToUpdate,
  mockMalePatientRequest,
  mockUpdatedMalePatient,
} from '@tests/mocks/patient.mocks';

describe('Update Patient - Integration Test Suite', () => {
  const fastify = Fastify();
  const prisma = new PrismaClient();

  beforeAll(async () => {
    if (container.isRegistered('PatientRepository')) {
      container.clearInstances();
    }
    container.registerSingleton<IPatientRepository>('PatientRepository', PrismaPatientRepository);

    fastify.register(prismaPlugin);
    fastify.register(patientsRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await prisma.patient.deleteMany();
    await fastify.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.patient.deleteMany();
    await prisma.$executeRaw`ALTER TABLE Patient AUTO_INCREMENT = 1;`;
  });

  it('should update an existing patient', async () => {
    const created = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockMalePatientRequest,
    });

    expect(created.statusCode).toBe(201);

    const response = await fastify.inject({
      method: 'PUT',
      url: '/1',
      payload: mockMalePatientInputDataToUpdate,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockUpdatedMalePatient.toResponse());
  });

  it('should return 404 if the patient does not exist', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/9999',
      payload: { name: 'Does not matter' },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe('PATIENT_NOT_FOUND_ERROR');
  });
});
