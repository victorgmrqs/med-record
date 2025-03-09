import prisma from 'adapters/database/prisma/client';
import { PatientRequestDTO, UpdatePatientRequestDTO } from 'application/dto/patient.dto';
import { Patient } from 'domain/entities/patient/patient';

import { IPatientRepository } from './patient.repository.interface';

export class PrismaPatientRepository implements IPatientRepository {
  async create(patient: PatientRequestDTO): Promise<Patient> {
    const data = await prisma.patient.create({
      data: {
        ...patient,
        birthDate: new Date(patient.birthDate + 'T00:00:00.000Z'), // converte para Date válido
      },
    });
    const formatted = data.birthDate.toISOString().split('T')[0]; // extrai somente a data (YYYY-MM-DD)
    const patients = new Patient(
      data.id,
      data.name,
      data.email,
      data.phoneNumber,
      formatted, // usa a data formatada
      data.sex,
      Number(data.height),
      Number(data.weight),
    );
    return patients;
  }

  async findAll(): Promise<Patient[]> {
    const patients = await prisma.patient.findMany();
    return patients.map((patient) => {
      return new Patient(
        patient.id,
        patient.name,
        patient.email,
        patient.phoneNumber,
        patient.birthDate.toISOString(), // usa toISOString() para formato ISO
        patient.sex,
        Number(patient.height),
        Number(patient.weight),
      );
    });
  }
  async findByEmail(email: string): Promise<Boolean | null> {
    const patient = await prisma.patient.findFirst({ where: { email } });
    return patient ? true : null;
  }

  async findById(id: number): Promise<Patient | null> {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return null;
    return new Patient(
      patient.id,
      patient.name,
      patient.email,
      patient.phoneNumber,
      patient.birthDate.toISOString(),
      patient.sex,
      Number(patient.height),
      Number(patient.weight),
    );
  }

  async update(data: UpdatePatientRequestDTO): Promise<Patient> {
    const patient = await prisma.patient.update({
      where: { id: data.id },
      data,
    });
    return new Patient(
      patient.id,
      patient.name,
      patient.email,
      patient.phoneNumber,
      patient.birthDate.toISOString(),
      patient.sex,
      Number(patient.height),
      Number(patient.weight),
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.patient.delete({ where: { id } });
  }
}
