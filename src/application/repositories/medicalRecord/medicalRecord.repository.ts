import prisma from 'adapters/database/prisma/client';
import { CreateMedicalRecordRequestDTO, UpdateMedicalRecordRequestDTO } from 'application/dto/medicalRecord.dto';
import { MedicalRecord } from 'domain/entities/medicalRecord/medicalRecord';

import { IMedicalRecordRepository } from './medicalRecord.repository.interface';

export class PrismaMedicalRecordRepository implements IMedicalRecordRepository {
  async findAll(): Promise<MedicalRecord[]> {
    const records = await prisma.medical_records.findMany();
    return records.map(MedicalRecord.fromPrisma);
  }

  async findById(id: number): Promise<MedicalRecord | null> {
    const record = await prisma.medical_records.findUnique({ where: { id } });
    if (!record) return null;
    return MedicalRecord.fromPrisma(record);
  }

  async create(data: CreateMedicalRecordRequestDTO): Promise<MedicalRecord> {
    const record = await prisma.medical_records.create({
      data: {
        doctor_id: data.doctorId,
        patient_id: data.patientId,
        appointment_id: data.appointmentId,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        notes: data.notes,
      },
    });
    return MedicalRecord.fromPrisma(record);
  }

  async update(data: UpdateMedicalRecordRequestDTO): Promise<MedicalRecord> {
    const record = await prisma.medical_records.update({
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
    return MedicalRecord.fromPrisma(record);
  }
}
