import AppError from '@shared/errors/AppError';

export class Doctor {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
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
}
