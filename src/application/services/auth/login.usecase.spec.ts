import { IAuthService } from 'adapters/auth/auth';
import { AuthRequestDTO } from 'application/dto/auth.dto';
import { LoginUseCase } from 'application/services/auth/login.usecase';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import AppError from '@shared/errors/AppError';
import { mockDoctorDBResponseWithPassword, mockDoctorRepository } from '@tests/mocks/doctor.mock';
import { mockHashRepository } from '@tests/mocks/hash.mock';

const mockAuthService: IAuthService = {
  generateToken: vi.fn(),
  verifyToken: vi.fn(),
};

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    loginUseCase = new LoginUseCase(mockDoctorRepository, mockAuthService, mockHashRepository);
    vi.clearAllMocks();
  });

  it('should return a token when credentials are valid', async () => {
    const doctor = mockDoctorDBResponseWithPassword;

    const credentials: AuthRequestDTO = {
      email: 'joao.silva@example.com',
      password: 'secretpassword',
    };

    vi.spyOn(mockDoctorRepository, 'findByEmail').mockResolvedValue(doctor);
    vi.spyOn(mockHashRepository, 'compare').mockResolvedValue(true);

    vi.spyOn(mockAuthService, 'generateToken').mockReturnValue('fake-jwt-token');

    const result = await loginUseCase.execute(credentials);
    expect(result).toEqual({ token: 'fake-jwt-token' });
    expect(mockDoctorRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
    expect(mockAuthService.generateToken).toHaveBeenCalledWith({ id: doctor.id, email: doctor.email });
  });

  it('should throw an error when doctor is not found', async () => {
    const credentials: AuthRequestDTO = {
      email: 'doctor@test.com',
      password: 'secret123',
    };

    vi.spyOn(mockDoctorRepository, 'findByEmail').mockResolvedValue(null);

    await expect(loginUseCase.execute(credentials)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
  });

  it('should throw an error when password is incorrect', async () => {
    const credentials: AuthRequestDTO = {
      email: 'doctor@test.com',
      password: 'wrongpassword',
    };

    const doctor = mockDoctorDBResponseWithPassword;
    vi.spyOn(mockDoctorRepository, 'findByEmail').mockResolvedValue(doctor);
    vi.spyOn(mockHashRepository, 'compare').mockResolvedValueOnce(false);

    await expect(loginUseCase.execute(credentials)).rejects.toBeInstanceOf(AppError);
    expect(mockDoctorRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
  });
});
