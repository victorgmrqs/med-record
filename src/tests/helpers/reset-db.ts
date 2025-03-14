import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function resetDb() {
  // Desabilitar verificação de foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

  // Deletar registros das tabelas (DELETE não viola as constraints)
  await prisma.$executeRawUnsafe('DELETE FROM medical_records;');
  await prisma.$executeRawUnsafe('DELETE FROM appointments;');
  await prisma.$executeRawUnsafe('DELETE FROM patients;');
  await prisma.$executeRawUnsafe('DELETE FROM doctors;');

  // Resetar os auto-incrementos
  await prisma.$executeRawUnsafe('ALTER TABLE medical_records AUTO_INCREMENT = 1;');
  await prisma.$executeRawUnsafe('ALTER TABLE appointments AUTO_INCREMENT = 1;');
  await prisma.$executeRawUnsafe('ALTER TABLE patients AUTO_INCREMENT = 1;');
  await prisma.$executeRawUnsafe('ALTER TABLE doctors AUTO_INCREMENT = 1;');

  // Reabilitar verificação de foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
}
