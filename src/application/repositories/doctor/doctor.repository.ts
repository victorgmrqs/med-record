import prisma from 'adapters/database/prisma/client';
import { IDoctorDTO, IUpdateDoctorRequestDTO } from 'application/dto/doctor.dto';
import { Doctor } from 'domain/entities/doctor/doctor';
import { injectable } from 'tsyringe';

import { IDoctorRepository } from './doctor.repository.interface';

@injectable()
export class PrismaDoctorRepository implements IDoctorRepository {
  async create(doctor: IDoctorDTO): Promise<Doctor> {
    const createdDoctor = await prisma.doctors.create({
      data: {
        name: doctor.name,
        email: doctor.email,
        password: doctor.password!,
      },
    });

    return Doctor.fromDBRepository(createdDoctor);
  }

  async findAll(): Promise<Doctor[]> {
    const doctors = await prisma.doctors.findMany({
      where: { deleted_at: null },
    });
    return doctors.map(Doctor.fromDBRepository);
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    const doctor = await prisma.doctors.findFirst({ where: { email } });
    if (!doctor) return null;
    return Doctor.fromDBRepository(doctor);
  }

  async findById(id: number): Promise<Doctor | null> {
    const doctor = await prisma.doctors.findUnique({ where: { id } });
    if (!doctor || doctor.deleted_at !== null) return null;
    return Doctor.fromDBRepository(doctor);
  }

  async update(doctor: IUpdateDoctorRequestDTO): Promise<Doctor> {
    const updatedDoctor = await prisma.doctors.update({
      where: { id: doctor.id },
      data: doctor,
    });
    return Doctor.fromDBRepository(updatedDoctor);
  }

  async delete(doctorId: number): Promise<void> {
    await prisma.doctors.update({
      where: { id: doctorId },
      data: {
        name: { set: null },
        email: { set: null },
        password: { set: null },
        deleted_at: new Date(),
      },
    });
  }
}
