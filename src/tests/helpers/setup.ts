import { container } from 'tsyringe';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import { PrismaClient } from '@prisma/client';

import resetDb from './reset-db';

beforeEach(async () => {
  await resetDb();
});

beforeEach(() => {
  container.clearInstances();
});

if (process.env.VITEST_WORKER_ID) {
  const prismaForSetup = new PrismaClient();

  beforeAll(async () => {
    try {
      await prismaForSetup.doctor.deleteMany();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao limpar o banco de dados:', e);
    }
  });

  afterAll(async () => {
    await prismaForSetup.$disconnect();
  });
}
