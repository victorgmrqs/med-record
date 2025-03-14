import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function resetDb() {
  // Desabilitar verificação de foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

  // TRUNCATE reseta as tabelas e os auto-incrementos
  await prisma.$executeRawUnsafe('TRUNCATE TABLE medical_records;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE appointments;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE patients;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE doctors;');

  // Reabilitar verificação de foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
}
