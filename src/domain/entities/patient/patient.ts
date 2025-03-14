import { IPatientResponse, PatientResponseDTO } from 'application/dto/patient.dto';

import AppError from '@shared/errors/AppError';

export class Patient {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public phoneNumber: string,
    public birthDate: string,
    public sex: 'M' | 'F',
    public height: number,
    public weight: number,
    public doctorId: number,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date | null,
  ) {
    if (!this.isValidEmail(email)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email format', Patient.name);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Cria uma instância de Patient a partir dos dados retornados pelo Prisma.
   * Converte o birthDate para o formato 'YYYY-MM-DD'.
   *
   * @param patientData Dados retornados pelo Prisma.
   * @returns Uma instância de Patient.
   */
  public static fromDBRepository(patientData: {
    id: number;
    name: string | null;
    email: string | null;
    phone_number: string | null;
    birth_date: Date;
    sex: 'M' | 'F';
    height: any;
    weight: any;
    doctor_id: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
  }): Patient {
    const formattedBirthDate = patientData.birth_date.toISOString().split('T')[0];
    return new Patient(
      patientData.id,
      patientData.name ?? '',
      patientData.email ?? '',
      patientData.phone_number ?? '',
      formattedBirthDate,
      patientData.sex,
      Number(patientData.height),
      Number(patientData.weight),
      patientData.doctor_id,
      patientData.created_at,
      patientData.updated_at,
      patientData.deleted_at,
    );
  }

  public static toArrayResponse(patients: Patient[]): PatientResponseDTO[] {
    return patients.map((patient) => patient.toResponse());
  }

  public updateWith(data: Partial<Omit<Patient, 'id' | 'email' | 'doctorId'>>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.phoneNumber !== undefined) this.phoneNumber = data.phoneNumber;
    if (data.birthDate !== undefined) this.birthDate = this.formatDate(data.birthDate);
    if (data.height !== undefined) this.height = data.height;
    if (data.weight !== undefined) this.weight = data.weight;
  }

  // Método para formatar a data, se necessário
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date format');
    }
    return d.toISOString().split('T')[0];
  }

  public toResponse(): IPatientResponse {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      birthDate: new Date(this.birthDate).toISOString().split('T')[0],
      sex: this.sex,
      height: this.height,
      weight: this.weight,
      doctorId: this.doctorId,
    };
  }
}
