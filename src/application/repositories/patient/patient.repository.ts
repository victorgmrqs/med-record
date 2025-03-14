import prisma from 'adapters/database/prisma/client';
import { PatientRequestDTO, UpdatePatientRequestDTO } from 'application/dto/patient.dto';
import { Patient } from 'domain/entities/patient/patient';

import { IPatientRepository } from './patient.repository.interface';

export class PrismaPatientRepository implements IPatientRepository {
  async create(patient: PatientRequestDTO): Promise<Patient> {
    const data = await prisma.patients.create({
      data: {
        name: patient.name,
        email: patient.email,
        phone_number: patient.phoneNumber,
        birth_date: new Date(patient.birthDate + 'T00:00:00.000Z'),
        sex: patient.sex,
        height: patient.height,
        weight: patient.weight,
        doctor_id: patient.doctorId,
      },
    });
    return Patient.fromDBRepository(data);
  }

  async findAll(): Promise<Patient[]> {
    const patients = await prisma.patients.findMany({
      where: { deleted_at: null },
    });
    return patients.map(Patient.fromDBRepository);
  }

  async findByEmail(email: string): Promise<boolean> {
    const patient = await prisma.patients.findFirst({ where: { email } });
    return !!patient;
  }

  async findById(id: number): Promise<Patient | null> {
    const patient = await prisma.patients.findUnique({ where: { id } });
    if (!patient || patient.deleted_at !== null) return null;
    return Patient.fromDBRepository(patient);
  }

  async update(data: UpdatePatientRequestDTO): Promise<Patient> {
    const patient = await prisma.patients.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone_number: data.phoneNumber,
        birth_date: data.birthDate ? new Date(data.birthDate + 'T00:00:00.000Z') : undefined,
        height: data.height,
        weight: data.weight,
      },
    });
    return Patient.fromDBRepository(patient);
  }

  async delete(id: number): Promise<void> {
    await prisma.patients.update({
      where: { id },
      data: {
        name: { set: null },
        email: { set: null },
        phone_number: { set: null },
        deleted_at: new Date(),
      },
    });
  }
}
