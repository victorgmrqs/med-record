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
import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMedicalRecordDBResponse, mockMedicalRecordInputRequest } from '@tests/mocks/medicalRecord.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Get Medical Record by ID Integration Test Suite', () => {
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

  it('should return the medical record by ID successfully', async () => {
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

    const createdRecord = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });
    const medicalRecordID = createdRecord.json().id;
    const response = await fastify.inject({
      method: 'GET',
      url: `/medical-records/${medicalRecordID}`,
    });

    const record = response.json();
    expect(response.statusCode).toBe(200);
    expect(record).toStrictEqual(mockMedicalRecordDBResponse.toResponse());
  });

  it('should return 404 when medical record is not found', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/medical-records/9999',
    });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      code: 'MEDICAL_RECORD_NOT_FOUND',
      message: 'No medical record found',
      service: 'GetMedicalRecordController',
    });
  });

  it('should return 400 when id parameter is invalid', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/medical-records/invalid',
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toMatch(/Validation error/);
  });
});
