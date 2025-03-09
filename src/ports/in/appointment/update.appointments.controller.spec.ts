import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Update Appointment Integration Test Suite', () => {
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

  it('should update an existing appointment successfully', async () => {
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

    const createPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: createPayload,
    });
    expect(createResponse.statusCode).toBe(201);

    const updatePayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T17:00:00.000Z').toISOString(),
    };
    const updateResponse = await fastify.inject({
      method: 'PUT',
      url: '/appointments/1',
      payload: updatePayload,
    });
    expect(updateResponse.statusCode).toBe(200);
    const updatedAppointment = updateResponse.json();
    expect(updatedAppointment).toHaveProperty('id', 1);
    expect(updatedAppointment).toHaveProperty('doctorId', doctorId);
    expect(updatedAppointment).toHaveProperty('patientId', patientId);
    expect(updatedAppointment.appointmentDate).toBe(new Date('2020-01-01T17:00:00.000Z').toISOString());
  });

  it('should return 404 when updating a non-existent appointment', async () => {
    const updatePayload = {
      doctorId: 1,
      patientId: 2,
      appointmentDate: new Date('2020-01-01T17:00:00.000Z').toISOString(),
    };

    const updateResponse = await fastify.inject({
      method: 'PUT',
      url: '/appointments/9999',
      payload: updatePayload,
    });
    expect(updateResponse.statusCode).toBe(404);
    expect(updateResponse.json()).toEqual({
      statusCode: 404,
      code: 'APPOINTMENT_NOT_FOUND',
      message: 'No appointment found with the given id: 9999',
      service: 'UpdateAppointmentController',
    });
  });

  it('should return 400 when payload is invalid', async () => {
    const updateResponse = await fastify.inject({
      method: 'PUT',
      url: '/appointments/1',
      payload: {
        doctorId: 'invalid',
        appointmentDate: 'not-a-date',
      },
    });
    expect(updateResponse.statusCode).toBe(400);
    const data = updateResponse.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toMatch(/Validation error/);
  });

  it('should return 400 when doctor does not exist', async () => {
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

    const createPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: createPayload,
    });
    expect(createResponse.statusCode).toBe(201);

    const updatePayload = {
      doctorId: 999,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const response = await fastify.inject({
      method: 'PUT',
      url: '/appointments/1',
      payload: updatePayload,
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
    const patientResponse = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId = doctorResponse.json().id;
    const patientId = patientResponse.json().id;

    const createPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: createPayload,
    });
    expect(createResponse.statusCode).toBe(201);

    const updatePayload = {
      doctorId,
      patientId: 999,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const response = await fastify.inject({
      method: 'PUT',
      url: '/appointments/1',
      payload: updatePayload,
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

    const createPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: createPayload,
    });
    expect(createResponse.statusCode).toBe(201);

    const updatePayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T06:00:00.000Z').toISOString(),
    };
    const response = await fastify.inject({
      method: 'PUT',
      url: '/appointments/1',
      payload: updatePayload,
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

    const firstPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const createResponse1 = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: firstPayload,
    });
    expect(createResponse1.statusCode).toBe(201);

    const secondPayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T17:00:00.000Z').toISOString(),
    };
    const createResponse2 = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: secondPayload,
    });
    expect(createResponse2.statusCode).toBe(201);

    const updatePayload = {
      doctorId,
      patientId,
      appointmentDate: new Date('2020-01-01T16:00:00.000Z').toISOString(),
    };
    const conflictResponse = await fastify.inject({
      method: 'PUT',
      url: `/appointments/${createResponse2.json().id}`,
      payload: updatePayload,
    });

    expect(conflictResponse.statusCode).toBe(400);
    expect(conflictResponse.json()).toMatchObject({
      statusCode: 400,
      code: 'SCHEDULING_CONFLICT',
      message: 'Doctor has another appointment during this time slot',
    });
  });
});
