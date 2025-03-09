import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { patientsRoutes } from 'adapters/http/patient.routes';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';

import { PrismaClient } from '@prisma/client';
import { mockMalePatientRequest } from '@tests/mocks/patient.mocks';

describe('Create patient Suite test - Integration', () => {
  const fastify = Fastify();
  const prisma = new PrismaClient();
  beforeAll(async () => {
    if (container.isRegistered('PatientRepository')) {
      container.clearInstances();
    }
    container.registerSingleton('PatientRepository', PrismaPatientRepository);

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
});
