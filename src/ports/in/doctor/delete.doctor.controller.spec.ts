import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';

describe('Delete Doctor - Integration Test', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);
    fastify.register(prismaPlugin);
    fastify.register(doctorRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should create a doctor and get all doctors', async () => {
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockInputDoctorData,
    });

    expect(createResponse.statusCode).toBe(201);

    const createdId = createResponse.json().id;

    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: `/${createdId}`,
    });

    expect(deleteResponse.statusCode).toBe(204);

    const getDoctorResponse = await fastify.inject({
      method: 'GET',
      url: `/${createdId}`,
    });

    expect(getDoctorResponse.statusCode).toBe(404);
  });

  it('should return an empty array when no doctors are present', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/9999',
    });

    expect(response.statusCode).toBe(404);
  });
});
