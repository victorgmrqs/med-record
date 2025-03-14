import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Get Appointment by ID Integration Test Suite', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton('AppointmentRepository', PrismaAppointmentRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);
    container.registerSingleton('PatientRepository', PrismaPatientRepository);

    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return the appointment by ID successfully', async () => {
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

    const appointmentPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };

    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: appointmentPayload,
    });
    expect(createResponse.statusCode).toBe(201);

    const appointmentID = createResponse.json().id;

    const getResponse = await fastify.inject({
      method: 'GET',
      url: `/appointments/${appointmentID}`,
    });
    expect(getResponse.statusCode).toBe(200);
    const appointment = getResponse.json();
    expect(appointment).toHaveProperty('id', 1);
    expect(appointment).toHaveProperty('doctorId', doctorId);
    expect(appointment).toHaveProperty('patientId', patientId);
    expect(new Date(appointment.appointmentDate).toISOString()).toBeDefined();
  });

  it('should return 404 when appointment is not found', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/appointments/9999',
    });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: 'APPOINTMENT_NOT_FOUND',
      message: 'Appointment not found',
      service: 'GetAppointmentController',
    });
  });

  it('should return 400 when id parameter is invalid', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/appointments/invalid',
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      service: 'GetAppointmentController',
      fields: ['id'],
      issues: [
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'nan',
          path: ['id'],
          message: 'Expected number, received nan',
        },
      ],
    });
  });
});
