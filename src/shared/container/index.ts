import 'reflect-metadata';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { PrismaPatientRepository } from 'application/repositories/patient/patient.repository';
import { IPatientRepository } from 'application/repositories/patient/patient.repository.interface';
import { container } from 'tsyringe';

container.registerSingleton<IDoctorRepository>('DoctorRepository', PrismaDoctorRepository);
container.registerSingleton<IPatientRepository>('PatientRepository', PrismaPatientRepository);
