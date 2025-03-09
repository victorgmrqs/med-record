import 'reflect-metadata';

import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import { container } from 'tsyringe';

container.registerSingleton<IDoctorRepository>('DoctorRepository', PrismaDoctorRepository);
