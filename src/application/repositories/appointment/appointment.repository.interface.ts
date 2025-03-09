import { CreateAppointmentRequestDTO, UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { Appointment } from 'domain/entities/appointment/appointments';

export interface IAppointmentRepository {
  findAll(): Promise<Appointment[]>;
  findById(id: number): Promise<Appointment | null>;
  findDoctorAppointments(doctorId: number): Promise<Appointment[]>;
  findPatientAppointments(patientId: number): Promise<Appointment[]>;
  findByDate(date: Date): Promise<Appointment[]>;
  findByDay(day: Date): Promise<Appointment[]>;
  isDoctorAvailable(doctorId: number, start: Date, end: Date): Promise<Boolean>;
  findByDoctorAndDate(doctorId: number, date: Date): Promise<Appointment[]>;
  findByPatientAndDate(patientId: number, date: Date): Promise<Appointment[]>;
  create(appointment: CreateAppointmentRequestDTO): Promise<Appointment>;
  update(appointment: UpdateAppointmentRequestDTO): Promise<Appointment>;
  delete(id: number): Promise<void>;
}
