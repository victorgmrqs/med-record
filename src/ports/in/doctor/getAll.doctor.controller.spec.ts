import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mockgetAllDoctorResponse, mockInputDoctorData } from '@tests/mocks/doctor.mock';

describe('Get all doctors Suite test - Integration', () => {
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
    const createdDoctor = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockInputDoctorData,
    });

    expect(createdDoctor.statusCode).toBe(201);

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockgetAllDoctorResponse);
  });

  it('should return an empty array when no doctors are present', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });
});
