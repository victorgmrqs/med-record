import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockAppointmentInputRequest } from '@tests/mocks/appointment.mock';
import { mockInputDoctorData, mockInputDoctorData2 } from '@tests/mocks/doctor.mock';
import { mockMedicalRecordInputRequest } from '@tests/mocks/medicalRecord.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Create Medical Record Integration Test Suite', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton('MedicalRecordRepository', PrismaMedicalRecordRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);
    container.registerSingleton('PatientRepository', PrismaPatientRepository);
    container.registerSingleton('AppointmentRepository', PrismaAppointmentRepository);

    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should create a medical record successfully', async () => {
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

    const appointmentResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: { ...mockAppointmentInputRequest, doctorId, patientId },
    });
    const appointmentId = appointmentResponse.json().id;
    expect(appointmentResponse.statusCode).toBe(201);

    const response = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });

    expect(response.statusCode).toBe(201);
    const responseBody = response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toMatchObject({
      message: 'Medical record created successfully',
      id: responseBody.id,
    });
  });

  it('should return 400 when payload is invalid', async () => {
    const invalidPayload = {
      doctorId: 1,
      patientId: 1,
      appointmentId: 1,
      diagnosis: '',
      prescription: '',
      notes: '',
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: invalidPayload,
    });

    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toMatch(/Validation error/);
  });

  it('should return 400 when doctor does not exist', async () => {
    const payload = {
      doctorId: 9999,
      patientId: 1,
      appointmentId: 1,
      diagnosis: 'Any',
      prescription: 'Any',
      notes: 'Test record',
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toMatch(/Doctor not found/);
  });

  it('should return 400 when patient does not exist', async () => {
    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const doctorId = doctorResponse.json().id;

    const payload = {
      doctorId,
      patientId: 9999,
      appointmentId: 1,
      diagnosis: 'Any',
      prescription: 'Any',
      notes: 'Test record',
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toMatch(/Patient not found/);
  });

  it('should return 400 when appointment does not exist', async () => {
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

    const payload = {
      doctorId,
      patientId,
      appointmentId: 9999,
      diagnosis: 'Any',
      prescription: 'Any',
      notes: 'Test record',
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toBe('Appointment not found');
  });

  it('should return 400 when appointment does not match the provided doctor and patient', async () => {
    const doctorResponse1 = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const doctorResponse2 = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData2,
    });
    const patientResponse = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId1 = doctorResponse1.json().id;
    const doctorId2 = doctorResponse2.json().id;
    const patientId = patientResponse.json().id;

    const appointmentResponse = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: {
        doctorId: doctorId2,
        patientId,
        appointmentDate: '2020-01-01T16:00:00.000Z',
      },
    });
    const appointmentId = appointmentResponse.json().id;

    const payload = {
      doctorId: doctorId1,
      patientId,
      appointmentId,
      diagnosis: 'Any',
      prescription: 'Any',
      notes: 'Test record',
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Appointment does not match the provided doctor and patient',
      service: 'CreateMedicalRecordController',
    });
  });
});
