export class Appointment {
  constructor(
    public readonly id: number,
    public doctorId: number,
    public patientId: number,
    public appointmentDate: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  public toResponse(): { id: number; doctorId: number; patientId: number; appointmentDate: string } {
    return {
      id: this.id,
      doctorId: this.doctorId,
      patientId: this.patientId,
      appointmentDate: this.appointmentDate.toISOString(),
    };
  }

  public static fromDBRepository(appt: {
    id: number;
    doctor_id: number;
    patient_id: number;
    appointment_date: Date;
    created_at?: Date;
    updated_at?: Date;
  }): Appointment {
    return new Appointment(
      appt.id,
      appt.doctor_id,
      appt.patient_id,
      appt.appointment_date,
      appt.created_at,
      appt.updated_at,
    );
  }

  public static toArrayResponse(
    appointments: Appointment[],
  ): { id: number; doctorId: number; patientId: number; appointmentDate: string }[] {
    return appointments.map((appt) => appt.toResponse());
  }
}
