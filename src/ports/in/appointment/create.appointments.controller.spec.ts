import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockAppointmentInputRequest } from '@tests/mocks/appointment.mock';
import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Create Appointments Suite Test', () => {
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

  it('should create an appointment successfully when no conflict exists and within business hours', async () => {
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

    const response = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });
    expect(response.statusCode).toBe(201);
  });

  it('should return 400 when doctor does not exist', async () => {
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
    const patientId = createdPatient.json().id;

    const inputBody = {
      ...mockAppointmentInputRequest,
      doctorId: 999,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Doctor not found',
    });
  });

  it('should return 400 when patient does not exist', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const doctorId = doctorResponse.json().id;

    const inputBody = {
      ...mockAppointmentInputRequest,
      doctorId,
      patientId: 999,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Patient not found',
    });
  });

  it('should return 400 when appointment time is outside business hours', async () => {
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
      appointmentDate: new Date('2020-01-01T06:00:00.000Z').toISOString(),
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'OUTSIDE_BUSINESS_HOURS',
      message: 'Appointment time must be between 7:00 and 19:00',
    });
  });
  it('should return 400 when there is a scheduling conflict', async () => {
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
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };

    const firstResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });
    expect(firstResponse.statusCode).toBe(201);

    const conflictResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: inputBody,
    });
    expect(conflictResponse.statusCode).toBe(400);
    expect(conflictResponse.json()).toMatchObject({
      statusCode: 400,
      code: 'SCHEDULING_CONFLICT',
      message: 'Doctor has another appointment during this time slot',
    });
  });

  it('should return 400 when payload is invalid', async () => {
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

    const invalidPayload = {
      doctorId,
      patientId,
      appointmentDate: 'invalid-date-format',
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: invalidPayload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      service: 'CreateAppointmentController',
      fields: ['appointmentDate'],
      issues: [{ code: 'custom', message: 'Input not instance of Date', fatal: true, path: ['appointmentDate'] }],
    });
  });
});
