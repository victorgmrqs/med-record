import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mockInputDoctorData, mockInputDoctorDataToUpdate, mockUpdatedDoctor } from '@tests/mocks/doctor.mock';

describe('Update Doctor - Integration Test', () => {
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

  it('should update an existing doctor', async () => {
    const created = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: mockInputDoctorData,
    });

    expect(created.statusCode).toBe(201);

    const createdId = created.json().id;
    const response = await fastify.inject({
      method: 'PUT',
      url: `/${createdId}`,
      payload: mockInputDoctorDataToUpdate,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockUpdatedDoctor.toResponse());
  });

  it('should return 404 if doctor does not exists ', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/9999',
      payload: { name: 'Não Importa' },
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe('DOCTOR_NOT_FOUND_ERROR');
  });
});
