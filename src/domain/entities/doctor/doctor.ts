import { DoctorResponseDTO } from 'application/dto/doctor.dto';

import AppError from '@shared/errors/AppError';

export class Doctor {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    private _password?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date | null,
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

  public toResponse(): { id: number; name: string; email: string } {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }

  public static toArrayResponse(doctors: Doctor[]): DoctorResponseDTO[] {
    return doctors.map((doctor) => doctor.toResponse());
  }

  public static fromDBRepository(doctorData: {
    id: number;
    name: string | null;
    email: string | null;
    password: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
  }): Doctor {
    return new Doctor(
      doctorData.id,
      doctorData.name ?? '',
      doctorData.email ?? '',
      doctorData.password ?? '',
      doctorData.created_at,
      doctorData.updated_at,
      doctorData.deleted_at,
    );
  }
}
