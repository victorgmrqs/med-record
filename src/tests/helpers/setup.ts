import { container } from 'tsyringe';
import { afterAll, beforeAll, beforeEach } from 'vitest';

import { PrismaClient } from '@prisma/client';

import resetDb from './reset-db';

beforeEach(async () => {
  await resetDb();
});

// Limpar o container antes de cada execução
beforeEach(() => {
  container.clearInstances();
});

// Para testes de integração, garantir que cada teste tem acesso a um banco limpo
if (process.env.VITEST_WORKER_ID) {
  // Esta parte é executada para cada worker de teste
  const prismaForSetup = new PrismaClient();

  beforeAll(async () => {
    try {
      // Garantir que começamos com um banco limpo
      await prismaForSetup.doctor.deleteMany();
      // Outros modelos também devem ser limpos aqui
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Erro ao limpar o banco de dados:', e);
    }
  });

  afterAll(async () => {
    await prismaForSetup.$disconnect();
  });
}
