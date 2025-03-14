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
import { mockMalePatientDBResponse, mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Get Patient by ID Suite test - Integration', () => {
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

  it('should return a patient by ID', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    expect(doctorResponse.statusCode).toBe(201);
    const doctorId = doctorResponse.json().id;
    const patientCreate = { ...mockMalePatientRequest, doctorId };
    const patientCreted = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: patientCreate,
    });

    const patientId = patientCreted.json().id;

    const response = await fastify.inject({ method: 'GET', url: `/patients/${patientId}` });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockMalePatientDBResponse.toResponse());
  });

  it('should return 404 when the patient is not found', async () => {
    const response = await fastify.inject({ method: 'GET', url: '/patients/1' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: 'PATIENT_NOT_FOUND_ERROR',
      message: 'No patient found with the given id: 1',
      service: 'GetPatientController',
    });
  });
});
