import prisma from 'adapters/database/prisma/client';
import { CreateMedicalRecordRequestDTO, UpdateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';

import { IMedicalRecordRepository } from './medicalRecord.respository.interface';

export class PrismaMedicalRecordRepository implements IMedicalRecordRepository {
  async findAll(): Promise<MedicalRecord[]> {
    const records = await prisma.medicalRecord.findMany();
    return records.map(
      (record) =>
        new MedicalRecord(
          record.id,
          record.doctor_id,
          record.patient_id,
          record.appointment_id,
          record.diagnosis ?? undefined,
          record.prescription ?? undefined,
          record.notes ?? undefined,
          record.created_at,
          record.updated_at,
        ),
    );
  }

  async findById(id: number): Promise<MedicalRecord | null> {
    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) return null;
    return new MedicalRecord(
      record.id,
      record.doctor_id,
      record.patient_id,
      record.appointment_id,
      record.diagnosis ?? undefined,
      record.prescription ?? undefined,
      record.notes ?? undefined,
      record.created_at,
      record.updated_at,
    );
  }

  async create(data: CreateMedicalRecordRequestDTO): Promise<MedicalRecord> {
    const record = await prisma.medicalRecord.create({
      data: {
        doctor_id: data.doctorId,
        patient_id: data.patientId,
        appointment_id: data.appointmentId,
        description: data.notes,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        notes: data.notes,
      },
    });
    return new MedicalRecord(
      record.id,
      record.doctor_id,
      record.patient_id,
      record.appointment_id,
      record.diagnosis ?? undefined,
      record.prescription ?? undefined,
      record.notes ?? undefined,
      record.created_at,
      record.updated_at,
    );
  }

  async update(data: UpdateMedicalRecordRequestDTO): Promise<MedicalRecord> {
    const record = await prisma.medicalRecord.update({
      where: { id: data.id },
      data: {
        doctor_id: data.doctorId,
        patient_id: data.patientId,
        appointment_id: data.appointmentId,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        notes: data.notes,
      },
    });
    return new MedicalRecord(
      record.id,
      record.doctor_id,
      record.patient_id,
      record.appointment_id,
      record.diagnosis ?? undefined,
      record.prescription ?? undefined,
      record.notes ?? undefined,
      record.created_at,
      record.updated_at,
    );
  }
}
