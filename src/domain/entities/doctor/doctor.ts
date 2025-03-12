import { DoctorResponseDTO } from 'application/dto/doctor.dto';

import AppError from '@shared/errors/AppError';

export class Doctor {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public _password?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    if (!this.isValidEmail(email)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email format', Doctor.name);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public get password(): string | undefined {
    return this._password;
  }

  public static toArrayResponse(doctors: Doctor[]): DoctorResponseDTO[] {
    return doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
    }));
  }

  public toResponse(): { id: number; name: string; email: string } {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

  public static mapDoctorToResponse(doctors: Doctor[]): { id: number; name: string; email: string }[] {
    return doctors.map((doctor) => doctor.toResponse());
  }
}
