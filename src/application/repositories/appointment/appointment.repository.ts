import prisma from 'adapters/database/prisma/client';
import { CreateAppointmentRequestDTO, UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { Appointment } from 'domain/entities/appointment/appointments';

import { IAppointmentRepository } from './appointment.repository.interface';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async findAll(): Promise<Appointment[]> {
    const appointments = await prisma.appointments.findMany();
    return appointments.map(Appointment.fromDBRepository);
  }

  async findById(id: number): Promise<Appointment | null> {
    const appt = await prisma.appointments.findUnique({ where: { id } });
    if (!appt) return null;
    return Appointment.fromDBRepository(appt);
  }
  async findByDoctorAndDate(doctorId: number, date: Date): Promise<Appointment[]> {
    const appointments = await prisma.appointments.findMany({ where: { doctor_id: doctorId, appointment_date: date } });
    return appointments.map(Appointment.fromDBRepository);
  }

  async isDoctorAvailable(doctorId: number, start: Date, end: Date): Promise<boolean> {
    const appointments = await prisma.appointments.findMany({
      where: {
        doctor_id: doctorId,
        appointment_date: {
          gte: start,
          lt: end,
        },
      },
    });
    return appointments.length === 0;
  }

  async create(appointment: CreateAppointmentRequestDTO): Promise<Appointment> {
    const appt = await prisma.appointments.create({
      data: {
        doctor_id: appointment.doctorId,
        patient_id: appointment.patientId,
        appointment_date: new Date(appointment.appointmentDate),
      },
    });
    return Appointment.fromDBRepository(appt);
  }

  async update(appointment: UpdateAppointmentRequestDTO): Promise<Appointment> {
    const appt = await prisma.appointments.update({
      where: { id: appointment.id },
      data: {
        appointment_date: new Date(appointment.appointmentDate),
      },
    });
    return Appointment.fromDBRepository(appt);
  }

  async delete(id: number): Promise<void> {
    await prisma.appointments.delete({ where: { id } });
  }
}
