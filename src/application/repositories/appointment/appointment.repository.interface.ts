import { CreateAppointmentRequestDTO, UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { Appointment } from 'domain/entities/appointment/appointments';

export interface IAppointmentRepository {
  findAll(): Promise<Appointment[]>;
  findById(id: number): Promise<Appointment | null>;
  findByDoctorAndDate(patientId: number, date: Date): Promise<Appointment[]>;
  isDoctorAvailable(doctorId: number, start: Date, end: Date): Promise<Boolean>;
  create(appointment: CreateAppointmentRequestDTO): Promise<Appointment>;
  update(appointment: UpdateAppointmentRequestDTO): Promise<Appointment>;
  delete(id: number): Promise<void>;
}
