import 'reflect-metadata';
import { container } from 'tsyringe';
import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

import { PrismaClient } from '@prisma/client';

import resetDb from './reset-db';

vi.mock('@middlewares/jwt.middleware', () => ({
  verifyToken: (_req: any, _reply: any, done: () => void) => {
    done();
  },
  AuthMiddleware: class {
    get(_request: any, _reply: any, done: () => void) {
      done();
    }
  },
}));

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
