import prisma from 'adapters/database/prisma/client';
import { CreateAppointmentRequestDTO, UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { Appointment } from 'domain/entities/appointment/appointments';

import { IAppointmentRepository } from './appointment.repository.interface';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async findAll(): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany();
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }

  async findById(id: number): Promise<Appointment | null> {
    const appt = await prisma.appointment.findUnique({ where: { id } });
    if (!appt) return null;
    return new Appointment(
      appt.id,
      appt.doctor_id,
      appt.patient_id,
      appt.appointmentDate,
      appt.created_at,
      appt.updated_at,
    );
  }
  async findDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({ where: { doctor_id: doctorId } });
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }
  async findPatientAppointments(patientId: number): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({ where: { patient_id: patientId } });
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }
  async findByDate(date: Date): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({ where: { appointmentDate: date } });
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }
  async findByDay(day: Date): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: day,
          lt: new Date(day.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }

  async isDoctorAvailable(doctorId: number, start: Date, end: Date): Promise<boolean> {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
        appointmentDate: {
          gte: start,
          lt: end,
        },
      },
    });
    return appointments.length === 0;
  }

  async findByDoctorAndDate(doctorId: number, date: Date): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({ where: { doctor_id: doctorId, appointmentDate: date } });
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }
  async findByPatientAndDate(patientId: number, date: Date): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
      where: { patient_id: patientId, appointmentDate: date },
    });
    return appointments.map(
      (appt) =>
        new Appointment(
          appt.id,
          appt.doctor_id,
          appt.patient_id,
          appt.appointmentDate,
          appt.created_at,
          appt.updated_at,
        ),
    );
  }

  async create(appointment: CreateAppointmentRequestDTO): Promise<Appointment> {
    const appt = await prisma.appointment.create({
      data: {
        doctor_id: appointment.doctorId,
        patient_id: appointment.patientId,
        appointmentDate: appointment.appointmentDate,
      },
    });
    return new Appointment(
      appt.id,
      appt.doctor_id,
      appt.patient_id,
      appt.appointmentDate,
      appt.created_at,
      appt.updated_at,
    );
  }

  async update(appointment: UpdateAppointmentRequestDTO): Promise<Appointment> {
    const appt = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        doctor_id: appointment.doctorId,
        patient_id: appointment.patientId,
        appointmentDate: appointment.appointmentDate,
      },
    });
    return new Appointment(
      appt.id,
      appt.doctor_id,
      appt.patient_id,
      appt.appointmentDate,
      appt.created_at,
      appt.updated_at,
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }
}
