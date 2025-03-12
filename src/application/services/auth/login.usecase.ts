import { IAuthService } from 'adapters/auth/auth';
import { AuthRequestDTO } from 'application/dto/auth.dto';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { IHashRepository } from 'application/repositories/hash/crypto.repository.interface';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

@injectable()
export class LoginUseCase {
  constructor(
    @inject('DoctorRepository')
    private doctorRepository: IDoctorRepository,
    @inject('AuthService')
    private authService: IAuthService,
    @inject('HashRepository')
    private hashRepository: IHashRepository,
  ) {}

  async execute({ email, password }: AuthRequestDTO): Promise<{ token: string }> {
    const doctor = await this.doctorRepository.findByEmail(email);
    if (!doctor) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials', LoginUseCase.name);
    }
    if (!doctor.password) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials', LoginUseCase.name);
    }
    const comparePassword = await this.hashRepository.compare(password, doctor.password);
    if (!comparePassword) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid credentials', LoginUseCase.name);
    }
    const token = this.authService.generateToken({ id: doctor.id, email: doctor.email });
    return { token };
  }
}
