import 'reflect-metadata';
import { container } from 'tsyringe';
import { beforeAll, afterAll, beforeEach } from 'vitest';

import { PrismaClient } from '@prisma/client';

import resetDb from './reset-db';

export const prisma = new PrismaClient();
container.registerInstance(PrismaClient, prisma);

beforeAll(async () => {
  await prisma.$connect();
  await resetDb();
});

afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

beforeEach(async () => {
  await resetDb();
  container.clearInstances();
});
