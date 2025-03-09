import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function resetDb() {
  // Desabilitar verificação de foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

  // TRUNCATE reseta as tabelas e os auto-incrementos
  await prisma.$executeRawUnsafe('TRUNCATE TABLE MedicalRecord;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE Appointment;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE DoctorPatient;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE Patient;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE Doctor;');

  // Reabilitar verificação de foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
}
