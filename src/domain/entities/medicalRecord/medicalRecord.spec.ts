import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';
import { describe, it, expect } from 'vitest';

describe('MedicalRecord Entity', () => {
  it('should create an instance and return a correct response', () => {
    const record = new MedicalRecord(
      1,
      101,
      201,
      301,
      'Diagnosis text',
      'Prescription text',
      'Notes text',
      new Date('2023-03-10T10:00:00Z'),
      new Date('2023-03-11T10:00:00Z'),
    );

    const response = record.toResponse();
    expect(response).toEqual({
      id: 1,
      doctorId: 101,
      patientId: 201,
      appointmentId: 301,
      diagnosis: 'Diagnosis text',
      prescription: 'Prescription text',
      notes: 'Notes text',
    });
  });

  it('toArrayResponse should map an array of MedicalRecord instances correctly', () => {
    const record1 = new MedicalRecord(
      1,
      101,
      201,
      301,
      'Diagnosis 1',
      'Prescription 1',
      'Notes 1',
      new Date('2023-03-10T10:00:00Z'),
      new Date('2023-03-11T10:00:00Z'),
    );
    const record2 = new MedicalRecord(
      2,
      102,
      202,
      302,
      'Diagnosis 2',
      'Prescription 2',
      'Notes 2',
      new Date('2023-03-12T10:00:00Z'),
      new Date('2023-03-13T10:00:00Z'),
    );
    const arrayResponse = MedicalRecord.toArrayResponse([record1, record2]);
    expect(arrayResponse).toEqual([record1.toResponse(), record2.toResponse()]);
  });

  it('fromPrisma should convert null values to undefined', () => {
    const prismaRecord = {
      id: 1,
      doctor_id: 101,
      patient_id: 201,
      appointment_id: 301,
      diagnosis: null,
      prescription: 'Prescription text',
      notes: null,
      created_at: new Date('2023-03-10T10:00:00Z'),
      updated_at: new Date('2023-03-11T10:00:00Z'),
    };

    const record = MedicalRecord.fromPrisma(prismaRecord);
    expect(record).toBeInstanceOf(MedicalRecord);
    expect(record.diagnosis).toBeUndefined();
    expect(record.prescription).toBe('Prescription text');
    expect(record.notes).toBeUndefined();
  });
});
