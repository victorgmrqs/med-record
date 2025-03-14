import { describe, expect, it } from 'vitest';

import { Appointment } from './appointments';

describe('Appointment Entity', () => {
  it('should create the Appointment instance correctly', () => {
    const appointment = new Appointment(1, 1, 1, new Date('2022-01-01T00:00:00Z'));
    expect(appointment.id).toBe(1);
    expect(appointment.doctorId).toBe(1);
    expect(appointment.patientId).toBe(1);
    expect(appointment.appointmentDate.toISOString()).toBe('2022-01-01T00:00:00.000Z');
  });

  it('should create an instance from DB repository data', () => {
    const dbData = {
      id: 1,
      doctor_id: 1,
      patient_id: 1,
      appointment_date: new Date('2022-01-01T00:00:00Z'),
      created_at: new Date('2022-01-01T00:00:00Z'),
      updated_at: new Date('2022-01-01T00:00:00Z'),
    };
    const appointment = Appointment.fromDBRepository(dbData);
    expect(appointment.id).toBe(1);
    expect(appointment.doctorId).toBe(1);
    expect(appointment.patientId).toBe(1);
    expect(appointment.appointmentDate.toISOString()).toBe('2022-01-01T00:00:00.000Z');
  });

  it('should return the response in the correct format (toResponse)', () => {
    const appointment = new Appointment(1, 1, 1, new Date('2022-01-01T00:00:00Z'));
    const response = appointment.toResponse();
    expect(response).toEqual({
      id: 1,
      doctorId: 1,
      patientId: 1,
      appointmentDate: '2022-01-01T00:00:00.000Z',
    });
  });

  it('should return a list of responses with toArrayResponse', () => {
    const appointments = [
      new Appointment(1, 1, 1, new Date('2022-01-01T00:00:00Z')),
      new Appointment(2, 2, 2, new Date('2022-01-02T00:00:00Z')),
    ];
    const responses = Appointment.toArrayResponse(appointments);
    expect(responses).toEqual([
      {
        id: 1,
        doctorId: 1,
        patientId: 1,
        appointmentDate: '2022-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        doctorId: 2,
        patientId: 2,
        appointmentDate: '2022-01-02T00:00:00.000Z',
      },
    ]);
  });
});
