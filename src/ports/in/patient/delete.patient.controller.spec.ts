import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Delete Patient | Integration test suite', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton<IPatientRepository>('PatientRepository', PrismaPatientRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);
    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('Delete an Existant patient', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    expect(doctorResponse.statusCode).toBe(201);
    const doctorId = doctorResponse.json().id;

    const patientCreate = { ...mockMalePatientRequest, doctorId };
    const created = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });

    expect(created.statusCode).toBe(201);
    const createdPatientID = created.json().id;

    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: `/patients/${createdPatientID}`,
    });

    expect(deleteResponse.statusCode).toBe(204);
  });
  it('Delete a non-existent patient returns 404', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/patients/999',
    });
    expect(response.statusCode).toBe(404);
  });

  it('Delete with malformed ID returns 400', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/patients/invalid-id-format',
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      message: 'Validation error',
    });
  });
});
