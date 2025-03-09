import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Delete Appointment Integration Test Suite', () => {
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

  it('should delete an existing appointment successfully', async () => {
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

    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: `/appointments/${appointmentID}`,
    });
    expect(deleteResponse.statusCode).toBe(204);

    const getResponse = await fastify.inject({
      method: 'GET',
      url: `/appointments/${appointmentID}`,
    });
    expect(getResponse.statusCode).toBe(404);
    expect(getResponse.json()).toEqual({
      statusCode: 404,
      code: 'APPOINTMENT_NOT_FOUND',
      message: 'No appointment found with the given id: 1',
      service: 'GetAppointmentController',
    });
  });

  it('should return 404 when trying to delete a non-existent appointment', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/appointments/9999',
    });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: 'APPOINTMENT_NOT_FOUND',
      message: 'No appointment found with the given id: 9999',
      service: 'DeleteAppointmentController',
    });
  });
});
