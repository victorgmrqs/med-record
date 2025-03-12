import 'reflect-metadata';
import { AuthService } from 'adapters/auth/auth';
import { PrismaAppointmentRepository } from 'application/repositories/appointment/appointment.repository';
import { IAppointmentRepository } from 'application/repositories/appointment/appointment.repository.interface';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import { PrismaMedicalRecordRepository } from 'application/repositories/medicalRecord/medicalRecord.repository';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { container } from 'tsyringe';

container.registerSingleton<IDoctorRepository>('DoctorRepository', PrismaDoctorRepository);
container.registerSingleton<IPatientRepository>('PatientRepository', PrismaPatientRepository);
container.registerSingleton<IAppointmentRepository>('AppointmentRepository', PrismaAppointmentRepository);
container.registerSingleton('MedicalRecordRepository', PrismaMedicalRecordRepository);
container.registerSingleton('AuthService', AuthService);
container.registerSingleton('HashRepository', CryptoHashRepository);
