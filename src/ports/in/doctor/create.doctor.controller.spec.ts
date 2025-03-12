import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';

describe('Create Doctor | Integration Test Suite', () => {
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

  it('should create a doctor', async () => {
    const doctorCreate = mockInputDoctorData;
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: doctorCreate,
    });
    const createdID = response.json().id;
    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ message: 'Doctor created successfully', id: createdID });
  });

  it('should return an error when creating a doctor with an existing email', async () => {
    const doctorCreate = mockInputDoctorData;
    await fastify.inject({
      method: 'POST',
      url: '/',
      payload: doctorCreate,
    });

    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: doctorCreate,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Doctor already exists',
      service: 'CreateDoctorController',
    });
  });

  it('should return an error when creating a doctor with invalid data', async () => {
    const invalidDoctor = { ...mockInputDoctorData, email: 'invalid-email' };

    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: invalidDoctor,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      fields: ['email'],
      issues: [
        {
          code: 'invalid_string',
          message: 'Invalid email format',
          path: ['email'],
          validation: 'email',
        },
      ],
      message: 'Validation error',
      service: 'CreateDoctorController',
    });
  });

  it('should return an error when creating a doctor without required fields', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      fields: ['name', 'email', 'password'],
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['name'],
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['email'],
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['password'],
        },
      ],
      message: 'Validation error',
      service: 'CreateDoctorController',
    });
  });
});
