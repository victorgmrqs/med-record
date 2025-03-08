import prisma from 'adapters/database/prisma/client';
import { IDoctorDTO, IUpdateDoctorRequestDTO } from 'application/dto/doctor.dto';
import { Doctor } from 'domain/entities/doctor/doctor';
import { injectable } from 'tsyringe';

import { IDoctorRepository } from './doctor.repository.interface';

@injectable()
export class PrismaDoctorRepository implements IDoctorRepository {
  async create(doctor: IDoctorDTO): Promise<Doctor> {
    const createdDoctor = await prisma.doctor.create({ data: doctor });
    return new Doctor(
      createdDoctor.id,
      createdDoctor.name,
      createdDoctor.email,
      createdDoctor.created_at,
      createdDoctor.updated_at,
    );
  }

  async findAll(): Promise<Doctor[]> {
    const doctors = await prisma.doctor.findMany();
    return doctors.map((doc) => new Doctor(doc.id, doc.name, doc.email, doc.created_at, doc.updated_at));
  }

  async findByEmail(email: string): Promise<Boolean | null> {
    const doctor = await prisma.doctor.findFirst({ where: { email } });
    return doctor ? true : null;
  }

  async findById(id: number): Promise<Doctor | null> {
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) return null;
    return new Doctor(doctor.id, doctor.name, doctor.email, doctor.created_at, doctor.updated_at);
  }

  async update(doctor: IUpdateDoctorRequestDTO): Promise<Doctor> {
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: { name: doctor.name, email: doctor.email },
    });
    return new Doctor(
      updatedDoctor.id,
      updatedDoctor.name,
      updatedDoctor.email,
      updatedDoctor.created_at,
      updatedDoctor.updated_at,
    );
  }

  async delete(doctorId: number): Promise<void> {
    await prisma.doctor.delete({
      where: { id: doctorId },
    });
  }
}
