import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';

describe('Get Doctor by ID Suite test - Integration', () => {
  const fastify = Fastify();
  beforeAll(async () => {
    container.registerSingleton<IDoctorRepository>('DoctorRepository', PrismaDoctorRepository);
    fastify.register(prismaPlugin);
    fastify.register(doctorRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return a doctor by ID', async () => {
    const doctorCreate = mockInputDoctorData;

    const createDoctor = await fastify.inject({ method: 'POST', url: '/', payload: doctorCreate });
    const createdID = createDoctor.json().id;
    const response = await fastify.inject({
      method: 'GET',
      url: `/${createdID}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ id: createdID, ...doctorCreate });
  });

  it('should return 404 when doctor is not found', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/1',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: 'DOCTOR_NOT_FOUND_ERROR',
      message: 'No Doctor found with the given id: 1',
      service: 'GetDoctorController',
    });
  });

  it('should return 400 when id parameter is invalid', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/abc',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('message', 'Validation error');
  });
});
