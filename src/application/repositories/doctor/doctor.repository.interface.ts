import { IDoctorDTO, IUpdateDoctorRequestDTO } from 'application/dto/doctor.dto';
import { Doctor } from 'domain/entities/doctor';

export interface IDoctorRepository {
  create(doctor: IDoctorDTO): Promise<Doctor>;
  update(doctor: IUpdateDoctorRequestDTO): Promise<Doctor>;
  delete(doctorId: number): Promise<void>;
  findById(doctorId: number): Promise<Doctor | null>;
  findByEmail(email: string): Promise<Boolean | null>;
  findAll(): Promise<Doctor[]>;
}
