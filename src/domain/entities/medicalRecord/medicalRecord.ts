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

  public static toArrayResponse(records: MedicalRecord[]): {
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

  /**
   * Cria uma instância de MedicalRecord a partir dos dados retornados pelo Prisma.
   *
   * @param record Dados do registro médico no formato retornado pelo Prisma.
   * @returns Uma instância de MedicalRecord.
   */
  public static fromPrisma(record: {
    id: number;
    doctor_id: number;
    patient_id: number;
    appointment_id: number;
    diagnosis: string | null;
    prescription: string | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
  }): MedicalRecord {
    return new MedicalRecord(
      record.id,
      record.doctor_id,
      record.patient_id,
      record.appointment_id,
      record.diagnosis === null ? undefined : record.diagnosis,
      record.prescription === null ? undefined : record.prescription,
      record.notes === null ? undefined : record.notes,
      record.created_at,
      record.updated_at,
    );
  }
}
