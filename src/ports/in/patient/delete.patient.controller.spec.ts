import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { PrismaClient } from '@prisma/client';
import { mockMalePatientRequest } from '@tests/mocks/patient.mocks';

describe('Delete Patient | Integration test suite', () => {
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

  it('Delete an Existant patient', async () => {
    const created = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockMalePatientRequest,
    });

    expect(created.statusCode).toBe(201);

    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: '/1',
    });

    expect(deleteResponse.statusCode).toBe(204);
  });
});
