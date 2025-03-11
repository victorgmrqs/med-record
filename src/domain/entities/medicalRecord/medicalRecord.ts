export class MedicalRecord {
  constructor(
    public readonly id: number,
    public doctorId: number,
    public patientId: number,
    public appointmentId: number,
    public diagnosis?: string,
    public prescription?: string,
    public notes?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  public toResponse(): {
    id: number;
    doctorId: number;
    patientId: number;
    appointmentId: number;
    diagnosis?: string;
    prescription?: string;
    notes?: string;
  } {
    return {
      id: this.id,
      doctorId: this.doctorId,
      patientId: this.patientId,
      appointmentId: this.appointmentId,
      diagnosis: this.diagnosis,
      prescription: this.prescription,
      notes: this.notes,
    };
  }

  public static mapRecordsToResponse(records: MedicalRecord[]): {
    id: number;
    doctorId: number;
    patientId: number;
    appointmentId: number;
    diagnosis?: string;
    prescription?: string;
    notes?: string;
  }[] {
    return records.map((record) => record.toResponse());
  }
}
