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
import { mockCreatedDoctor2, mockInputDoctorData } from '@tests/mocks/doctor.mock';
import { mockMedicalRecordInputRequest } from '@tests/mocks/medicalRecord.mock';
import { mockMalePatientRequest } from '@tests/mocks/patient.mock';

describe('Update Medical Record Integration Test Suite', () => {
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

  it('should update a medical record successfully', async () => {
    const doctorRes = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const patientRes = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId = doctorRes.json().id;
    const patientId = patientRes.json().id;

    const appointmentRes = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: { ...mockAppointmentInputRequest, doctorId, patientId },
    });
    const appointmentId = appointmentRes.json().id;

    const createRes = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });
    const recordId = createRes.json().id;

    const updatePayload = {
      id: recordId,
      diagnosis: 'Updated medical record diagnosis',
      prescription: 'Updated prescription',
      notes: 'Updated notes',
    };
    const updateRes = await fastify.inject({
      method: 'PUT',
      url: `/medical-records/${recordId}`,
      payload: updatePayload,
    });
    expect(updateRes.statusCode).toBe(200);
    const updateBody = updateRes.json();
    expect(updateBody).toMatchObject({
      id: recordId,
      diagnosis: updatePayload.diagnosis,
      prescription: updatePayload.prescription,
      notes: updatePayload.notes,
    });
  });

  it('should return 400 for invalid update payload', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/medical-records/1',
      payload: { id: 'invalid' },
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toMatch(/Validation error/);
  });

  it('should return 404 when updating a non-existent medical record', async () => {
    const payload = {
      id: 99999,
      description: 'Update test',
    };
    const response = await fastify.inject({
      method: 'PUT',
      url: '/medical-records/1',
      payload,
    });
    expect(response.statusCode).toBe(404);
    const data = response.json();
    expect(data.message).toMatch(/No medical record found/);
  });

  it('should return 400 when updating with a non-existent doctor', async () => {
    const doctorRes = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const patientRes = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId = doctorRes.json().id;
    const patientId = patientRes.json().id;

    const appointmentRes = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: { ...mockAppointmentInputRequest, doctorId, patientId },
    });
    const appointmentId = appointmentRes.json().id;

    const createRes = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });
    const recordId = createRes.json().id;

    const payload = { id: recordId, doctorId: 9999 };
    const response = await fastify.inject({
      method: 'PUT',
      url: `/medical-records/${recordId}`,
      payload,
    });
    const data = response.json();
    expect(response.statusCode).toBe(400);
    expect(data.message).toMatch(/Doctor not found/);
  });

  it('should return 400 when updating with a non-existent patient', async () => {
    const doctorRes = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const patientRes = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId = doctorRes.json().id;
    const patientId = patientRes.json().id;

    const appointmentRes = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: { ...mockAppointmentInputRequest, doctorId, patientId },
    });
    const appointmentId = appointmentRes.json().id;

    const createRes = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });
    const recordId = createRes.json().id;

    const payload = { id: recordId, patientId: 9999 };
    const response = await fastify.inject({
      method: 'PUT',
      url: `/medical-records/${recordId}`,
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toMatch(/Patient not found/);
  });

  it('should return 400 when updating with a non-existent appointment', async () => {
    const doctorRes = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const patientRes = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId = doctorRes.json().id;
    const patientId = patientRes.json().id;

    const appointmentRes = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: { ...mockAppointmentInputRequest, doctorId, patientId },
    });
    const appointmentId = appointmentRes.json().id;

    const createRes = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId, patientId, appointmentId },
    });
    const recordId = createRes.json().id;

    const payload = { id: recordId, appointmentId: 9999 };
    const response = await fastify.inject({
      method: 'PUT',
      url: `/medical-records/${recordId}`,
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toMatch(/Appointment not found/);
  });

  it('should return 400 when appointment does not match provided doctor and patient', async () => {
    const doctorRes1 = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockInputDoctorData,
    });
    const doctorRes2 = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: mockCreatedDoctor2,
    });
    const patientRes = await fastify.inject({
      method: 'POST',
      url: '/patients',
      payload: mockMalePatientRequest,
    });
    const doctorId1 = doctorRes1.json().id;
    const doctorId2 = doctorRes2.json().id;
    const patientId = patientRes.json().id;

    const appointmentRes = await fastify.inject({
      method: 'POST',
      url: '/appointments',
      payload: { ...mockAppointmentInputRequest, doctorId: doctorId2, patientId },
    });
    const appointmentId = appointmentRes.json().id;

    const createRes = await fastify.inject({
      method: 'POST',
      url: '/medical-records',
      payload: { ...mockMedicalRecordInputRequest, doctorId: doctorId2, patientId, appointmentId },
    });
    const recordId = createRes.json().id;

    const payload = {
      id: recordId,
      doctorId: doctorId1,
    };
    const response = await fastify.inject({
      method: 'PUT',
      url: `/medical-records/${recordId}`,
      payload,
    });
    expect(response.statusCode).toBe(400);
    const data = response.json();
    expect(data.message).toMatch(/Appointment does not match the provided doctor and patient/);
  });
});
