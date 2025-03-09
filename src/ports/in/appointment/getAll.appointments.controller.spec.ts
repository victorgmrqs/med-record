import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockAppointmentInputRequest } from '@tests/mocks/appointment.mock';
import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Get all appointments Suite test - Integration', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton('AppointmentRepository', PrismaAppointmentRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('PatientRepository', PrismaPatientRepository);
    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return an empty array of appointments', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/appointments',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should return appointments with data', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });

    const patientResponse = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });

    const doctorId = doctorResponse.json().id;
    const patientId = patientResponse.json().id;

    const inputBody = {
      ...mockAppointmentInputRequest,
      doctorId,
      patientId,
    };

    await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });
    const response = await fastify.inject({
      method: 'GET',
      url: '/appointments',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().length).toBe(1);
  });
});
