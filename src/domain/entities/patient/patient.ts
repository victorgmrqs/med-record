import { PatientResponseDTO } from 'application/dto/patient.dto';

import logger from '@infra/logger';
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
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private formatDate(date: string): string {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      const message = 'Invalid date format. Expected format: YYYY-MM-DD';
      logger.error({
        message: message,
        service: Patient.name,
      });
      throw new AppError(400, 'INVALID_DATE_FORMAT', message, Patient.name);
    }
    return dateObj.toISOString();
  }

  public static mapPatientToResponse(patients: Patient[]): PatientResponseDTO[] {
    return patients.map((patient) => {
      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
        birthDate: new Date(patient.birthDate).toISOString().split('T')[0],
        sex: patient.sex,
        height: patient.height,
        weight: patient.weight,
      };
    });
  }

  public updateWith(data: Partial<Omit<Patient, 'id' | 'email'>>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.phoneNumber !== undefined) this.phoneNumber = data.phoneNumber;
    if (data.birthDate !== undefined) {
      this.birthDate = this.formatDate(data.birthDate);
    }
    if (data.sex !== undefined) this.sex = data.sex;
    if (data.height !== undefined) this.height = data.height;
    if (data.weight !== undefined) this.weight = data.weight;
  }
  public toResponse(): PatientResponseDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      birthDate: new Date(this.birthDate).toISOString().split('T')[0],
      sex: this.sex,
      height: this.height,
      weight: this.weight,
    };
  }
}
