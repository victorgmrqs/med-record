import { CreateAppointmentRequestDTO, UpdateAppointmentRequestDTO } from 'application/dto/appointment.dto';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { Appointment } from 'domain/entities/appointment/appointments';
import { vi } from 'vitest';

export const mockAppointmentRepository: IAppointmentRepository = {
  create: vi.fn(),
  delete: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findByDate: vi.fn(),
  findByDay: vi.fn(),
  isDoctorAvailable: vi.fn(),
  findByDoctorAndDate: vi.fn(),
  findByDoctorAndDate: vi.fn(),
  findDoctorAppointments: vi.fn(),
  findPatientAppointments: vi.fn(),
  update: vi.fn(),
};

export const mockAppointmentInputRequest: CreateAppointmentRequestDTO = {
  doctorId: 1,
  patientId: 2,
  appointmentDate: '2020-01-01T16:00:00.000Z',
};
export const mockAppointmentRequest: CreateAppointmentRequestDTO = {
  doctorId: 1,
  patientId: 2,
  appointmentDate: new Date('2020-01-01').toISOString(),
};

export const mockAppointmentDBResponse: Appointment = new Appointment(
  1,
  1,
  1,
  new Date('2020-01-01T16:00:00.000Z'),
  new Date(),
  new Date(),
);

export const mockAllAppointmentsResponse: Appointment[] = [mockAppointmentDBResponse];

export const mockAppointmentUpdateRequest: UpdateAppointmentRequestDTO = {
  id: 1,
  doctorId: 1,
  patientId: 2,
  appointmentDate: new Date('2020-01-02').toISOString(),
};
