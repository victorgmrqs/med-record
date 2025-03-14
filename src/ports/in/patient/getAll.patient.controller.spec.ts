import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { Patient } from 'domain/entities/patient/patient';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest, mockMalePatientDBResponse } from '@tests/mocks/patient.mock';

describe('Get all patients Suite test - Integration', () => {
  const fastify = Fastify();
  beforeAll(async () => {
    container.registerSingleton('PatientRepository', PrismaPatientRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);

    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return all patients and return an empty array', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/patients',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should return patients with data', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    expect(doctorResponse.statusCode).toBe(201);
    const doctorId = doctorResponse.json().id;

    const patientCreate = { ...mockMalePatientRequest, doctorId };
    const createdPatient = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });

    expect(createdPatient.statusCode).toBe(201);

    const response = await fastify.inject({
      method: 'GET',
      url: '/patients',
    });
    const expectedResponse = Patient.toArrayResponse([mockMalePatientDBResponse]);

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(expectedResponse);
  });
});
