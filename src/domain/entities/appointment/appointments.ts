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

  public static mapAppointmentsToResponse(
    appointments: Appointment[],
  ): { id: number; doctorId: number; patientId: number; appointmentDate: string }[] {
    const response = appointments.map((appt) => appt.toResponse());
    return response;
  }
}
