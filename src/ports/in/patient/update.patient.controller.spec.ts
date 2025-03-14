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
import {
  mockMalePatientInputDataToUpdate,
  mockMalePatientRequest,
  mockUpdatedMalePatient,
} from '@tests/mocks/patient.mock';

describe('Update Patient - Integration Test Suite', () => {
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

  it('should update an existing patient', async () => {
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
    const patientId = created.json().id;
    const response = await fastify.inject({
      method: 'PUT',
      url: `/patients/${patientId}`,
      payload: mockMalePatientInputDataToUpdate,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(mockUpdatedMalePatient.toResponse());
  });

  it('should return 404 if the patient does not exist', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/patients/9999',
      payload: { name: 'Does not matter' },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe('PATIENT_NOT_FOUND_ERROR');
  });
});
