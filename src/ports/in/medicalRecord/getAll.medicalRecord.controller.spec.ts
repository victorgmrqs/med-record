import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { PrismaMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { mockAppointmentInputRequest } from '@tests/mocks/appointment.mock';
import { mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockAllMedicalRecordsResponse, mockMedicalRecordInputRequest } from '@tests/mocks/medicalRecord.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Get All Medical Records Integration Test Suite', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton('MedicalRecordRepository', PrismaMedicalRecordRepository);
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('PatientRepository', PrismaPatientRepository);
    container.registerSingleton('AppointmentRepository', PrismaAppointmentRepository);

    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('should return an empty array when no medical records exist', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/medical-records',
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should return medical records when records exist', async () => {
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

    const createdMedicalRecord = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });

    expect(createdMedicalRecord.statusCode).toBe(201);

    const response = await fastify.inject({
      method: 'GET',
      url: '/medical-records',
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toEqual(mockAllMedicalRecordsResponse);
  });
});
